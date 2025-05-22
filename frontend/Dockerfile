# frontend/Dockerfile

FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Install Tailwind CSS, PostCSS, Autoprefixer & init config files
RUN npx tailwindcss init -p

# Copy all project files
COPY . .

# Ensure correct permissions (optional but helpful in dev)
RUN chmod -R 755 /app

# Expose the Next.js dev server port
EXPOSE 3000

# Run the dev server
CMD ["npm", "run", "dev"]
