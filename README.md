# Diyvps

# Активация виртуального окружения

#### установка виртуального окружения

```bash 
python3 -m venv venv 
```

#### активация

```bash 
source venv/bin/activate # для linux
```

```bash 
venv\Scripts\activate.bat # для windows
```

# Установка необходимых пакетов

#### обновление pip

```bash
python3 -m pip install --upgrade pip
```

#### установка зависимостей

```bash
pip3 install -r requirements.txt # основные зависимости
```

# Применение миграций

```bash
python3 manage.py makemigrations # создать миграцию
```

```bash
python3 manage.py migrate # применить миграцию
```

# Запуск сервера

```bash
python3 manage.py runserver
```

