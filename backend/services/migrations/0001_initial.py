# Generated by Django 2.2.6 on 2020-04-27 14:30

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('price', models.IntegerField()),
                ('promotion_price', models.IntegerField(blank=True)),
                ('is_published', models.BooleanField(default=True)),
                ('list_date', models.DateTimeField(blank=True, default=datetime.datetime.now)),
                ('salon', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='salons.Salon')),
            ],
        ),
    ]
