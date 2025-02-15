from django.shortcuts import render
from rest_framework import generics
from .models import Sticker
from .serializers import StickerSerializer, CategorySerializer,TagSerializer
from .models import Category,User,Tag
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from .permissions import IsOwnerOrReadOnly


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
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# views that let users view tags
class TagList(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

# pagination for stickers
class StickerPagination(PageNumberPagination):
    page_size = 10


# View for listing stickers (accessible by everyone)
class StickerListView(generics.ListAPIView):
    queryset = Sticker.objects.filter(is_private=False)
    serializer_class = StickerSerializer
    pagination_class = StickerPagination

    def get_queryset(self):
        """
        Only allow public stickers to be viewed by everyone.
        Private stickers can only be accessed by their owner.
        """
        if self.request.user.is_authenticated:
            # If the user is authenticated, they can view their private stickers
            return Sticker.objects.filter(owner=self.request.user) | Sticker.objects.filter(is_private=False)
        # If the user is not authenticated, they can only see public stickers
        return Sticker.objects.filter(is_private=False)

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
            return Sticker.objects.filter(owner=self.request.user) | Sticker.objects.filter(is_private=False)
        # If the user is not authenticated, they can only see public stickers
        return Sticker.objects.filter(is_private=False)



