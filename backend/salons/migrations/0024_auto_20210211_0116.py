# Generated by Django 2.2.6 on 2021-02-10 21:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('salons', '0023_remove_salon_page_view'),
    ]

    operations = [
        migrations.AlterField(
            model_name='salon',
            name='price_range',
            field=models.PositiveIntegerField(blank=True, choices=[(1, '$'), (2, '$$'), (3, '$$$'), (4, '$$$$')], default=2),
        ),
    ]
