# Generated by Django 2.2.6 on 2021-02-11 11:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('salons', '0024_auto_20210211_0116'),
    ]

    operations = [
        migrations.AlterField(
            model_name='salon',
            name='facebook',
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AlterField(
            model_name='salon',
            name='instagram',
            field=models.CharField(blank=True, max_length=500),
        ),
    ]