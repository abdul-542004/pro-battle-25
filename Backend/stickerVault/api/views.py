from django.shortcuts import render
from rest_framework import generics, filters
from .models import Sticker
from .serializers import StickerSerializer, CategorySerializer,TagSerializer
from .models import Category,User,Tag
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from .permissions import IsOwnerOrReadOnly
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework import serializers
from django.db.models import Prefetch
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.core.files import File
from django.http import HttpResponse
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
    # Only show public stickers
    queryset = Sticker.objects.filter(is_private=False).select_related('owner').prefetch_related('tags')
    serializer_class = StickerSerializer
    pagination_class = StickerPagination

    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'owner__username', 'tags__name', 'category__name', 'description']


class PrivateStickerListView(generics.ListAPIView):
    # All stickers uploaded by the authenticated user
    serializer_class = StickerSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StickerPagination

    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'tags__name', 'category__name', 'description']


    def get_queryset(self):
        # Filter stickers by the authenticated user
        return Sticker.objects.filter(owner=self.request.user).select_related('owner').prefetch_related('tags')

    

# View for creating stickers (only accessible to authenticated users)
class StickerCreateView(generics.CreateAPIView):
    queryset = Sticker.objects.all()
    serializer_class = StickerSerializer
    permission_classes = [IsAuthenticated]

    

    # Automatically set the owner to the logged-in user
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# views that let users view and delete stickers
class StickerDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StickerSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            # Authenticated users can see their own private stickers and all public stickers
            return Sticker.objects.filter(
                models.Q(owner=self.request.user) | models.Q(is_private=False)
            ).select_related('owner', 'category').prefetch_related('tags')
        # Unauthenticated users can only see public stickers
        return Sticker.objects.filter(is_private=False).select_related('owner', 'category').prefetch_related('tags')



class TrendingStickerListView(generics.ListAPIView):
    # Show the top 10 most liked stickers
    queryset = Sticker.objects.filter(is_private=False).select_related('owner').prefetch_related('tags').order_by('-likes')[:10]
    serializer_class = StickerSerializer




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
        # Prefetch stickers for each category
        categories = Category.objects.prefetch_related(
            Prefetch('stickers', queryset=Sticker.objects.filter(is_private=False))
        )

        data = []
        for category in categories:
            stickers = category.stickers.all()  # Get all stickers for this category
            serialized_stickers = StickerSerializer(stickers, many=True).data
            data.append({
                'category': category.name,
                'stickers': serialized_stickers
            })

        return Response(data)

