from rest_framework.serializers import ModelSerializer, SlugRelatedField, SerializerMethodField
from .models import User, Category, Tag, Sticker


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

    """
    image = SerializerMethodField()  # Convert relative image path to absolute URL
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None
    """


    


# For creating stickers
class StickerCreateSerializer(ModelSerializer):
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
        exclude = ['owner']  # Exclude owner since it will be set in the view

