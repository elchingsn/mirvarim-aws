# Generated by Django 2.2.6 on 2020-04-30 13:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='role',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Visitor'), (2, 'Freelancer'), (3, 'SalonAdmin')], default=1),
        ),
    ]