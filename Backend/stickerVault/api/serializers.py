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
        queryset=Tag.objects.all()
    )
    category = SlugRelatedField(
        slug_field='name',
        queryset=Category.objects.all()
    )

    class Meta:
        model = Sticker
        fields = '__all__'

   