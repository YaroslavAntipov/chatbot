# Chatbot Generator Next 13, Tailwind, Typescript and Strapi

note: This project was started with love by [Trecia](https://github.com/TreciaKS), [Daniel](https://github.com/malgamves) and [Paul](https://github.com/PaulBratslavsky). We were all new to Next 13 and Typescript. If you find any bugs or improvements feel free to create an issue. Thank you all for your support and participation.

![demo-site](https://user-images.githubusercontent.com/6153188/231865321-0da5e81f-4832-4cce-bcd1-ecd79e9b9cc3.gif)

If you prefer videos that guide you therought the setup process you can find them [here](https://github.com/strapi/nextjs-corporate-starter/issues/71)

## Getting Started

1. Clone the repository locally:

```bash
  git clone https://github.com/strapi/nextjs-corporate-starter.git
    or
  gh repo clone strapi/nextjs-corporate-starter
```

2. Run `setup` command to setup frontend and backend dependencies:

```bash
  yarn setup
```

3. Next, navigate to your `/backend` directory and set up your `.env` file. You can use the `.env.example` file as reference:

```bash
HOST=localhost
PORT=1337
APP_KEYS="toBeModified1,toBeModified2"
API_TOKEN_SALT=tobemodified
ADMIN_JWT_SECRET=tobemodified
JWT_SECRET=tobemodified
TRANSFER_TOKEN_SALT=tobemodified
```

4. Start your project by running the following command:

```bash
  yarn build
  yarn develop
```

You will be prompted to create your first admin user.

![admin-user](https://user-images.githubusercontent.com/6153188/231865420-5f03a90f-b893-4057-9634-9632920a7d97.gif)

Great. You now have your project running. Let's add some data.
