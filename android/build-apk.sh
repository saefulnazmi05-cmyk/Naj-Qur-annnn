#!/usr/bin/env bash
# ==============================================================================
# Naj Qur’an (com.najquran.app) - Native Android APK & AAB Build Script
# ==============================================================================
# This script automates the compilation, signing, and packaging of the Naj Qur'an
# Trusted Web Activity (TWA) Android Application.
#
# Usage:
#   ./build-apk.sh [debug|release|bundle|bubblewrap|help]
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Text styles
BOLD="\033[1m"
GREEN="\033[0;32m"
GOLD="\033[0;33m"
CYAN="\033[0;36m"
RED="\033[0;31m"
RESET="\033[0m"

echo -e "${BOLD}${GREEN}"
echo "=========================================================="
echo "      NAJ QUR’AN - ANDROID BUILD & PACKAGING SUITE        "
echo "      Package ID : com.najquran.app                       "
echo "      Primary    : #003B2E | Accent: #E0B030              "
echo "=========================================================="
echo -e "${RESET}"

show_help() {
  echo -e "${BOLD}Panduan Penggunaan:${RESET}"
  echo "  ./build-apk.sh debug       - Bangun Debug APK (app-debug.apk untuk testing perangkat/emulator)"
  echo "  ./build-apk.sh release     - Bangun Release APK (memerlukan keystore)"
  echo "  ./build-apk.sh bundle      - Bangun Android App Bundle (.aab untuk rilis Google Play Store)"
  echo "  ./build-apk.sh keystore    - Buat release keystore baru (interactive keytool)"
  echo "  ./build-apk.sh bubblewrap  - Bangun menggunakan Google Chrome Bubblewrap CLI"
  echo "  ./build-apk.sh help        - Tampilkan panduan ini"
  echo ""
}

check_java() {
  if ! command -v java &>/dev/null; then
    echo -e "${RED}[ERROR] Java (JDK 17+) tidak ditemukan.${RESET}"
    echo "Silakan pasang OpenJDK 17 atau Android Studio:"
    echo "  Ubuntu/Debian: sudo apt update && sudo apt install -y openjdk-17-jdk"
    echo "  macOS: brew install openjdk@17"
    echo "  Windows: unduh JDK 17 dari adoptium.net atau instal Android Studio."
    exit 1
  fi
  echo -e "${GREEN}[OK] Java terdeteksi:${RESET} $(java -version 2>&1 | head -n 1)"
}

check_android_sdk() {
  if [ -z "${ANDROID_HOME:-}" ] && [ -z "${ANDROID_SDK_ROOT:-}" ]; then
    # Try common default locations
    if [ -d "$HOME/Android/Sdk" ]; then
      export ANDROID_HOME="$HOME/Android/Sdk"
    elif [ -d "$HOME/Library/Android/sdk" ]; then
      export ANDROID_HOME="$HOME/Library/Android/sdk"
    elif [ -d "/usr/lib/android-sdk" ]; then
      export ANDROID_HOME="/usr/lib/android-sdk"
    fi
  fi

  if [ -n "${ANDROID_HOME:-}" ] && [ -d "${ANDROID_HOME:-}" ]; then
    echo -e "${GREEN}[OK] Android SDK terdeteksi di:${RESET} $ANDROID_HOME"
  else
    echo -e "${GOLD}[PERINGATAN] ANDROID_HOME belum diatur.${RESET}"
    echo "Pastikan Android SDK terpasang atau buka folder ini langsung di Android Studio."
  fi
}

make_gradlew_executable() {
  if [ -f "./gradlew" ]; then
    chmod +x ./gradlew
  else
    echo -e "${CYAN}[INFO] Mengunduh Gradle Wrapper jika belum ada...${RESET}"
    if command -v gradle &>/dev/null; then
      gradle wrapper --gradle-version 8.7
    fi
  fi
}

build_debug() {
  echo -e "\n${BOLD}${CYAN}--> Membangun Debug APK...${RESET}"
  check_java
  check_android_sdk
  make_gradlew_executable

  if [ -f "./gradlew" ]; then
    ./gradlew assembleDebug
    echo -e "\n${BOLD}${GREEN}✓ Debug APK berhasil dibangun!${RESET}"
    echo -e "Lokasi: ${BOLD}app/build/outputs/apk/debug/app-debug.apk${RESET}"
    echo "Anda dapat langsung menginstal ke perangkat Android dengan: adb install app/build/outputs/apk/debug/app-debug.apk"
  else
    echo -e "${RED}[ERROR] gradlew tidak ditemukan.${RESET}"
    echo "Rekomendasi: Buka folder /android ini di Android Studio untuk build otomatis satu klik."
    exit 1
  fi
}

build_release() {
  echo -e "\n${BOLD}${CYAN}--> Membangun Signed Release APK...${RESET}"
  check_java
  check_android_sdk
  make_gradlew_executable

  if [ -f "./gradlew" ]; then
    ./gradlew assembleRelease
    echo -e "\n${BOLD}${GREEN}✓ Release APK berhasil dibangun!${RESET}"
    echo -e "Lokasi: ${BOLD}app/build/outputs/apk/release/app-release.apk${RESET}"
  else
    echo -e "${RED}[ERROR] gradlew tidak ditemukan.${RESET}"
    exit 1
  fi
}

build_bundle() {
  echo -e "\n${BOLD}${CYAN}--> Membangun Android App Bundle (.aab) untuk Google Play Store...${RESET}"
  check_java
  check_android_sdk
  make_gradlew_executable

  if [ -f "./gradlew" ]; then
    ./gradlew bundleRelease
    echo -e "\n${BOLD}${GREEN}✓ Android App Bundle (.aab) berhasil dibangun!${RESET}"
    echo -e "Lokasi: ${BOLD}app/build/outputs/bundle/release/app-release.aab${RESET}"
    echo "Upload file ini ke Google Play Console -> Production / Internal Testing."
  else
    echo -e "${RED}[ERROR] gradlew tidak ditemukan.${RESET}"
    exit 1
  fi
}

create_keystore() {
  echo -e "\n${BOLD}${CYAN}--> Membuat Release Keystore Baru...${RESET}"
  KEYSTORE_FILE="najquran-release-key.jks"
  if [ -f "$KEYSTORE_FILE" ]; then
    echo -e "${GOLD}[PERINGATAN] File $KEYSTORE_FILE sudah ada.${RESET}"
    read -p "Apakah Anda ingin membuat baru dan menimpanya? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      exit 0
    fi
  fi

  keytool -genkeypair -v \
    -keystore "$KEYSTORE_FILE" \
    -alias najquran \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -dname "CN=Naj Quran, OU=Mobile, O=Naj Quran Digital, L=Jakarta, ST=DKI Jakarta, C=ID"

  echo -e "\n${BOLD}${GREEN}✓ Keystore berhasil dibuat: $KEYSTORE_FILE${RESET}"
  echo -e "${BOLD}${GOLD}Untuk membaca SHA256 Fingerprint (untuk .well-known/assetlinks.json):${RESET}"
  echo "keytool -list -v -keystore $KEYSTORE_FILE -alias najquran"
}

build_bubblewrap() {
  echo -e "\n${BOLD}${CYAN}--> Membangun dengan Google Chrome Bubblewrap CLI...${RESET}"
  if ! command -v bubblewrap &>/dev/null; then
    echo -e "${GOLD}[INFO] bubblewrap CLI belum terpasang. Memasang via npm...${RESET}"
    npm install -g @bubblewrap/cli
  fi

  bubblewrap build
  echo -e "\n${BOLD}${GREEN}✓ Bubblewrap build selesai!${RESET}"
}

ACTION="${1:-help}"

case "$ACTION" in
  debug)
    build_debug
    ;;
  release)
    build_release
    ;;
  bundle)
    build_bundle
    ;;
  keystore)
    create_keystore
    ;;
  bubblewrap)
    build_bubblewrap
    ;;
  help|*)
    show_help
    ;;
esac
