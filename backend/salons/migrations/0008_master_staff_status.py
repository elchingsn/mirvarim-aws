# Generated by Django 2.2.6 on 2020-12-28 09:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('salons', '0007_auto_20201227_1424'),
    ]

    operations = [
        migrations.AddField(
            model_name='master',
            name='staff_status',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]