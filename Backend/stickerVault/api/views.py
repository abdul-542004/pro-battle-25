# import the necessary modules
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.core.files import File
from django.db.models import Q, Prefetch, Count

from rest_framework import generics, filters, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Sticker, Category, User, Tag
from .serializers import StickerSerializer, CategorySerializer, TagSerializer, StickerCreateSerializer
from .permissions import IsOwnerOrReadOnly
from stickerVault.settings import BASE_DIR, MEDIA_ROOT

# Create your views here.

# register the user
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if not username or not password or not email:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password, email=email)
        return Response({"message": "User registered successfully! You can now login in."}, status=status.HTTP_201_CREATED)


# views that let users view categories
class CategoryList(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# views that let users view tags
class TagList(generics.ListCreateAPIView):
    queryset = Tag.objects.all().select_related('category')
    serializer_class = TagSerializer

# pagination for stickers
class StickerPagination(PageNumberPagination):
    page_size = 10


# View for listing stickers (accessible by everyone)
class StickerListView(generics.ListAPIView):
    queryset = (
        Sticker.objects
        .filter(is_private=False)
        .select_related('owner', 'category')  # ForeignKey fields
        .prefetch_related('tags','likes')  # ManyToManyField
    )
    serializer_class = StickerSerializer
    pagination_class = StickerPagination

    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'owner__username', 'tags__name', 'category__name', 'description']


class PrivateStickerListView(generics.ListAPIView):
    """
    API view to list all stickers owned by the authenticated user.
    """
    serializer_class = StickerSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'tags__name', 'category__name', 'description']

    def get_queryset(self):
        return (
            Sticker.objects
            .filter(owner=self.request.user)
            .select_related('owner', 'category')  # ForeignKey optimizations
            .prefetch_related('tags', 'likes')  # ManyToMany optimizations
        )
   

class StickerCreateView(generics.CreateAPIView):
    """
    API view to create a new sticker.
    """
    queryset = Sticker.objects.all()
    serializer_class = StickerCreateSerializer  
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        tags_data = self.request.data.get("tags", [])  # Get tags from request
        category_name = self.request.data.get("category", None)  # Get category from request

        # Create the sticker without tags and category
        sticker = serializer.save(owner=self.request.user)

        # Handle tags: create if not exist
        if isinstance(tags_data, list):  # Ensure it's a list
            for tag_name in tags_data:
                tag, _ = Tag.objects.get_or_create(name=tag_name.strip())  # Create tag if not exists
                sticker.tags.add(tag)  

        # Handle category: create if not exist
        if category_name:
            category, _ = Category.objects.get_or_create(name=category_name.strip())
            sticker.category = category
            sticker.save()


class StickerDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve, update or delete a sticker.
    """
    serializer_class = StickerSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        # Fetch stickers optimized with related data while ensuring that private stickers are only accessible by their owner.
        user = self.request.user

        # Construct a filtered queryset
        queryset = Sticker.objects.filter(Q(is_private=False) | Q(owner=user)).select_related('owner', 'category').prefetch_related('tags', 'likes')

        return queryset

    def get_object(self):
        # Retrieve a sticker while applying the optimized queryset.
        return get_object_or_404(self.get_queryset(), pk=self.kwargs["pk"])




class TrendingStickerListView(generics.ListAPIView):
    """
    API view to show the top 10 most liked stickers.
    """
    serializer_class = StickerSerializer

    def get_queryset(self):
        return (
            Sticker.objects.filter(is_private=False)
            .annotate(like_count=Count('likes'))  # Count likes
            .order_by('-like_count')  # Sort by like count
            .select_related('owner', 'category')  # Optimize ForeignKeys
            .prefetch_related('tags', 'likes')  # Optimize ManyToMany fields
        )[:10]  # Apply slicing inside `get_queryset` (not at class level)


class LikeStickerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, sticker_id):
        try:
            sticker = Sticker.objects.get(id=sticker_id)
            # Add the current user to the likes field
            if request.user in sticker.likes.all():
                sticker.likes.remove(request.user)
                return Response({"message": "Sticker unliked successfully"}, status=status.HTTP_200_OK)
            else:
                sticker.likes.add(request.user)
                return Response({"message": "Sticker liked successfully"}, status=status.HTTP_200_OK)

        except Sticker.DoesNotExist:
            return Response({"error": "Sticker not found"}, status=status.HTTP_404_NOT_FOUND)




class StickersByCategoryView(APIView):
    """
    API view to return all stickers grouped by category.
    """

    def get(self, request):
        # Fetch categories and prefetch stickers in one query
        categories = Category.objects.prefetch_related(
            Prefetch(
                'stickers',
                queryset=Sticker.objects.filter(is_private=False).select_related('category', 'owner').prefetch_related('tags', 'likes'),
                to_attr='prefetched_stickers'  # ✅ Avoids hitting DB multiple times
            )
        )

        # Serialize all stickers efficiently
        data = [
            {
                'category': category.name,
                'stickers': StickerSerializer(category.prefetched_stickers, many=True, context={'request': request}).data
            }
            for category in categories
        ]

        return Response(data)
