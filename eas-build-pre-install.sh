echo "Running pre-install script..."
echo "Looking for android/build.gradle..."

if [ -f "android/build.gradle" ]; then
  echo "✅ Found build.gradle. Patching Kotlin version..."
  sed -i.bak 's/kotlin_version = "1.9.24"/kotlin_version = "1.9.25"/' android/build.gradle
else
  echo "❌ build.gradle not found. Script skipped."
fi
