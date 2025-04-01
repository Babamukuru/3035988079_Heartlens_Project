This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

1. Project Overview:
   
The HeartLen App is a web-based tool designed to process photoplethysmography (PPG) signals captured via a webcam. It calculates heart rate, heart rate variability (HRV), and signal quality using machine learning models. The processed data can be saved to a MongoDB database for further analysis.

## Getting Started

2. Installation Instructions:

2.1 Set up app locally
### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB instance)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Babamukuru/303598807_Heartlens_Project.git
   cd heartlen-app

2.2 Install dependencies

npm run install

2.3 Set up environment variables

Create .env.local if it doesnt exist yet and paste your mongo DB link to it
MONGODB_URI=your_mongodb_connection_string

2.4 Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

2.5 Open the app in your browser:
Open [http://localhost:3000](http://localhost:3000) (Or whatever the result is) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Connecting to MongoDB
To link the app to your MongoDB database:
1. Create a MongoDB Atlas cluster or use a local MongoDB instance.
2. Copy the connection string from MongoDB Atlas and paste it into the `.env.local` file as shown above.
3. Ensure the database has a collection named `records` to store PPG data.

### Deployment
To deploy the app:
1. Build the production version:
   ```bash
   npm run build

  #If successful with no errors, run
     ```bash
   npm run start


   And run the local host in your browser.
