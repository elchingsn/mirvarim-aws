# Generated by Django 2.2.6 on 2021-01-22 11:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('salons', '0018_auto_20210120_1916'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='sms_count',
            field=models.PositiveIntegerField(blank=True, default=0),
        ),
    ]