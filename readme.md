### To run the project

install docker, then run docker compose to run dependencies

```
docker compose up -d --build
docker ps -a
```

To Run MainAPI/PRoducer:

1. CD mainapi
2. Run 'npm run mainapi'

To Run EmailSVC/Consumer:

1. CD emailsvc
2. Run 'npm run emailsvc'
3. Ensure the email auth details are filled in emailsvc/ .env


To Make Send an email via postman:

1. Postman : [POST] http://localhost:3000/api/v1/messages/
{
    "to": "testmail@gmail.com",
    "sub": "Hello",
    "body": "hello from MainApi!"
}