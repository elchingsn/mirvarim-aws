# Generated by Django 2.2.6 on 2021-01-19 10:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('salons', '0015_auto_20210119_1405'),
    ]

    operations = [
        migrations.AlterField(
            model_name='booking',
            name='created',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
