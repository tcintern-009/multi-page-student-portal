

# ---------- Stage 1: install dependencies ----------
FROM node:22-alpine AS deps

WORKDIR /app

# Copy only the dependency manifests first so Docker can cache
# the npm install layer and skip it when only source code changes.
COPY package*.json ./

# Install production dependencies only (no devDependencies)
RUN npm install --omit=dev


# ---------- Stage 2: runtime image ----------
FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Reuse the node_modules installed in the "deps" stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the application source code
# (files listed in .dockerignore are excluded, e.g. node_modules, .env, .git)
COPY . .

# The Express server listens on this port by default.
# Override at runtime with: docker run -e PORT=5000 ...
EXPOSE 5000

# Run the container as the non-root "node" user (built into the base image)
# instead of root, for better container security.
USER node

# Basic container health check hitting the API's /api/health endpoint.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- "http://localhost:${PORT:-5000}/api/health" || exit 1

# Start the Express server (same command used by "npm start")
CMD ["node", "server.js"]
