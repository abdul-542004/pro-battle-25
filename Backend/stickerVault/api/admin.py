from django.contrib import admin
from .models import Sticker, User, Category, Tag
# Register your models here.
admin.site.register(Sticker)
admin.site.register(User)
admin.site.register(Category)
admin.site.register(Tag)