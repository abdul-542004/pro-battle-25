from django.db import models
from django.contrib.auth.models import User,AbstractUser



class User(AbstractUser):
    pass

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    
class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


# Sticker (acts as a collection)
class Sticker(models.Model):
    name = models.CharField(max_length=100, unique=True) 
    description = models.TextField(blank=True)           
    owner = models.ForeignKey(User, on_delete=models.CASCADE) 
    image = models.ImageField(upload_to='stickers/', blank=False, null=False)  # Image upload for sticker (must have field)
    is_private = models.BooleanField(default=True)        # Private or public sticker
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp for creation
    updated_at = models.DateTimeField(auto_now=True)      # Timestamp for updates
    category = models.ForeignKey(Category, on_delete=models.CASCADE, blank=True, related_name="stickers")  # Category of sticker
    tags = models.ManyToManyField(Tag, related_name='tags', blank=True)  # Tags for sticker

    likes = models.ManyToManyField(User, related_name='likes', blank=True)  # Users who liked the sticker



    def __str__(self):
        return self.name
    



