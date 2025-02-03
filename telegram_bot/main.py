from collections import defaultdict
from dataclasses import dataclass, field
from datetime import UTC, datetime

import requests
import telebot

with open("./token.secret") as f:
    token = f.read().strip()


@dataclass
class Post:
    name: str
    content: list = field(default_factory = list)
    date: datetime = field(default_factory = lambda: datetime.now(UTC))

    def __post_init__(self):
        self.name = self.name.replace(" ", "-").lower()
        self.name = self.date.strftime("%Y-%m-%d") + "-" + self.name + ".md"

    def __str__(self):
        return self.name
    def __repr__(self):
        return f"Post(name={self.name}, date={self.date})"


@dataclass
class MediaGroup:
    media: list = field(default_factory = list)
    caption: str | None = None

bot = telebot.TeleBot(token)

posts = []
by_media_group: dict[int, MediaGroup] = defaultdict(MediaGroup)
current_post = None

@bot.message_handler(commands=['current'])
def current(message):
    bot.reply_to(message, repr(current_post))

@bot.message_handler(commands=['new'])
def new(message):
    if len(message.text.split()) < 2:
        bot.reply_to(message, "Please provide a name for the post")
        return
    
    name = message.text.removeprefix("/new ")
    post = Post(name)
    bot.reply_to(message, f"Made new post {post.name}")
    global current_post
    current_post = post

@bot.message_handler(func=lambda message: True, content_types=["text","photo", "audio"])
def echo_all(message):
    print(f"Got message type {message.content_type}")
    if not message.from_user.id == 166480434: return
    if not message.chat.type == "private": return
    if message.content_type == "text": 
        print(f"Message text: {message.text}")
    if message.content_type == "photo":
        if message.media_group_id:
            by_media_group[message.media_group_id].media.append(message)
            if message.caption: by_media_group[message.media_group_id].caption = message.caption
            print(by_media_group)
            
        # for photo in message.photo: print(photo)
        biggest = max(message.photo, key = lambda p : p.file_size)
        file_info = bot.get_file(biggest.file_id)
        file = requests.get(f'https://api.telegram.org/file/bot{token}/{file_info.file_path}')
        with open(f"telegram_photos/{biggest.file_id}.png", "wb") as f:
            f.write(file.content)
        
            

bot.infinity_polling()