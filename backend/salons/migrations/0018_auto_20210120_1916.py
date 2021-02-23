# Generated by Django 2.2.6 on 2021-01-20 15:16

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('salons', '0017_auto_20210120_1915'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='created',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='booking',
            name='task_id',
            field=models.CharField(blank=True, editable=False, max_length=50),
        ),
    ]
