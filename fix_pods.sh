# Переміщення RNPermissions.podspec у правильне місце
mkdir -p node_modules/react-native-permissions/ios
mv node_modules/react-native-permissions/RNPermissions.podspec node_modules/react-native-permissions/ios/ 2>/dev/null

echo "✅ Переміщено RNPermissions.podspec у ios/"