from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Category, Tag, Sticker


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    list_filter = ('is_staff', 'is_active')
    ordering = ('username',)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


class StickerAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'is_private', 'category', 'created_at', 'updated_at')
    search_fields = ('name', 'description', 'owner__username', 'category__name')
    list_filter = ('is_private', 'category', 'tags')
    date_hierarchy = 'created_at'
    autocomplete_fields = ('owner', 'category', 'tags')
    filter_horizontal = ('likes', 'tags')
    readonly_fields = ('created_at', 'updated_at')
    list_per_page = 20
    fieldsets = (
        ("Basic Info", {'fields': ('name', 'description', 'image', 'is_private')}),
        ("Relations", {'fields': ('owner', 'category', 'tags', 'likes')}),
        ("Timestamps", {'fields': ('created_at', 'updated_at')}),
    )


admin.site.register(Sticker, StickerAdmin)