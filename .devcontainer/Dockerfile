# [Choice] Debian OS version: bullseye, buster
FROM --platform=linux/amd64 mcr.microsoft.com/vscode/devcontainers/base:dev-bookworm

ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=${USER_UID}

ENV BUN_INSTALL=/bun
RUN sudo mkdir -p ${BUN_INSTALL} \
    && curl -fsSL https://bun.sh/install | bash \
    && chown -R ${USERNAME} /bun

ENV PATH=${BUN_INSTALL}/bin:${PATH}

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
   && apt-get -y install --no-install-recommends openjdk-17-jdk
