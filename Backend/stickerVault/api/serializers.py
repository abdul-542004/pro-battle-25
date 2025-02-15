from rest_framework.serializers import ModelSerializer
from .models import User, Category, Tag, Sticker
from django.core.exceptions import ValidationError
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, SlugRelatedField,SerializerMethodField
from rest_framework.exceptions import ValidationError


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class CategorySerializer(ModelSerializer):


    class Meta:
        model = Category
        fields = '__all__'

class TagSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class StickerSerializer(ModelSerializer):
    tags = SlugRelatedField(
        many=True,
        slug_field='name',
        queryset=Tag.objects.all(),
        required=False
    )
    category = SlugRelatedField(
        slug_field='name',
        queryset=Category.objects.all(),
        required=False
    )

    class Meta:
        model = Sticker
        fields = '__all__'

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        category_data = validated_data.pop('category', None)

        # Create a new sticker instance
        sticker = Sticker.objects.create(**validated_data)

        # Handle tags (create if they don't exist)
        for tag_name in tags_data:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            sticker.tags.add(tag)

        # Handle category (create if it doesn't exist)
        if category_data:
            category, _ = Category.objects.get_or_create(name=category_data)
            sticker.category = category
            sticker.save()

        return sticker

   