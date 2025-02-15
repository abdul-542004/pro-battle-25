from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='register'),

    path('stickers/', views.StickerListView.as_view(), name='sticker-list'),
    path('stickers/create/', views.StickerCreateView.as_view(), name='sticker-create'),
    path('stickers/<int:pk>/', views.StickerDetail.as_view(), name='sticker-detail'),

    
    path('categories/', views.CategoryList.as_view(), name='category-list'),
    path('tags/', views.TagList.as_view(), name='tag-list'),
]