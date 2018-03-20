# game-server-demo-Tic-tac-Toe-
#### A very simple multiplayer game server demonstration. Tic Tac Toe

## Setup instructions:

#### step 1: Clone the git repo.

```sh
git clone https://github.com/manjunath-satyamurthy/game-server-demo-Tic-tac-Toe-.git
```
  
#### step 2: Ensure you have python 2.7 and virtualenv installed

#### step 3: install virtual environment in the gameserver/ folder
```sh
cd game-server-demo-Tic-tac-Toe-/gameserver
virtualenv env
```

#### step 4: Activate environment:
```shell
. env/bin/activate
```
  
#### step 5: install requirements
```shell
pip install -r app/requirements.txt
```
  
#### step 6: Create users
```shell
python app/manage.py createsuperuser
```
>Follow the instructions to create user and repeat step 6 for multiple users
  
#### step 7: Start server
```shell
python app/manage.py runserver
```
  
#### step 7: Now open the url localhost:8000 in 2 different browser windows and login in with the different user account just created. Do not use 127.0.0.1 as there will be cross origin request issue.

## Architecture

![Game Server Architecture](https://i.imgur.com/Fh80LQp.png)

> The above picture describes the proposed architecture. Using django server as an http server, django-channels for websockets server, redis as a caching layer, celery for asynchronous tasks. 

> The above architecture can be modified a little bit to use token based authentication systems by additionally using DjangoRESTFramework(DRF). DRF integrates with Django and help developers create REST api's easily.

> Additional Note: This project uses python 2.7. It is advised to use python 3+ and hence have to update Django to version 2.0 and use the latest channels package for websockets.

> Please go through the documentations of the technologies used. [Django](https://www.djangoproject.com/), [DjangoRESTFramework](http://www.django-rest-framework.org/), [Channels](https://channels.readthedocs.io/en/latest/), [Redispy](https://github.com/andymccurdy/redis-py), [Celery](http://www.celeryproject.org/).

#### For any further help, Feel free to contact me at pass2rahul@gmail.com
