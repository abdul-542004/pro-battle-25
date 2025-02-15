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
from rest_framework.decorators import api_view


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
        return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)


# views that let users view categories
class CategoryList(generics.ListAPIView):
    queryset = Category.objects.all().select_related('parent_category')
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
    # Only show private stickers
    queryset = Sticker.objects.filter(is_private=True).select_related('owner').prefetch_related('tags')
    serializer_class = StickerSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StickerPagination

    

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
        """
        Only allow public stickers to be viewed by everyone.
        Private stickers can only be accessed by their owner.
        """
        if self.request.user.is_authenticated:
            # If the user is authenticated, they can view their private stickers
            return Sticker.objects.filter(owner=self.request.user).select_related('owner').prefetch_related('tags') | Sticker.objects.filter(is_private=False).select_related('owner').prefetch_related('tags')
        # If the user is not authenticated, they can only see public stickers
        return Sticker.objects.filter(is_private=False).select_related('owner').prefetch_related('tags')



@api_view(['POST'])
def like_sticker(request, sticker_id):
    sticker = get_object_or_404(Sticker, id=sticker_id)
    if request.user in sticker.likes.all():
        sticker.likes.remove(request.user)
        return Response({"message": "Sticker unliked."})
    else:
        sticker.likes.add(request.user)
        return Response({"message": "Sticker liked."})

