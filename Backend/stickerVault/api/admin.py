from django.contrib import admin
from .models import Sticker, Category, Tag, User

@admin.register(Sticker)
class StickerAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'category', 'is_private', 'created_at', 'updated_at', 'likes_count')
    list_filter = ('is_private', 'category', 'created_at', 'updated_at')
    search_fields = ('name', 'owner__username', 'category__name', 'tags__name', 'description')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ('owner', 'category', 'tags')  # Enables easy searching for foreign keys
    list_per_page = 20  # Limits the number of items per page
    filter_horizontal = ('tags', 'likes')  # Improves many-to-many field UI

    def likes_count(self, obj):
        return obj.likes.count()
    likes_count.short_description = "Likes"

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_active', 'is_staff', 'date_joined')
    search_fields = ('username', 'email')
    ordering = ('-date_joined',)
