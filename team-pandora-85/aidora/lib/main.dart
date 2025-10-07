import 'package:aidora/features/auth/services/auth_services.dart';
import 'package:aidora/features/welcome/screens/splash_screen.dart';
import 'package:aidora/utilities/themes/theme_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'features/aidora_ai/provider/aidora_chat_provider.dart';
import 'features/aidora_ai/provider/aidora_seek_settings_provider.dart';
import 'features/aidora_ai/provider/tts_provider.dart';
import 'features/aidora_ai/screens/aidora_chat_screen.dart';
import 'features/subscriptions/provider/aidora_version_provider.dart';
import 'features/user/provider/user_provider.dart';

void main() {
  _initializeSystemBG();
  runApp(MultiProvider(

    providers: [
      ChangeNotifierProvider(
        create: (context) => AidoraSeekSettingsProvider(),
      ),

      ChangeNotifierProvider(
        create: (context) => ThemeProvider(),
      ),


      ChangeNotifierProvider(create: (context) => UserProvider()),


      ChangeNotifierProvider(
        create: (context) => TTSProvider(),
      ),
      ChangeNotifierProvider(
        create: (context) => AidoraVersionProvider(),
      ),

      ChangeNotifierProvider(
        create: (_) => AidoraChatProvider(),
        child: const MaterialApp(home: AidoraChatScreen()),
      ),
    ],
    child: const MyApp(),
  ));
}

void _initializeSystemBG() {
  SystemChrome.setSystemUIOverlayStyle( SystemUiOverlayStyle(
    statusBarColor: Colors.white,
    statusBarIconBrightness: Brightness.light,
    systemNavigationBarColor: Colors.white,
    systemNavigationBarIconBrightness: Brightness.light,
  ));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {

    final themeProvider = Provider.of<ThemeProvider>(context);
    return ChangeNotifierProvider(
      create: (context) => AuthServices(),
      child: Consumer<AuthServices>(
        builder: (context, auth, _) => MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'Aidora',
          theme: themeProvider.getTheme(),
          darkTheme: ThemeData.dark(),
          themeMode: ThemeMode.system,
          home: const SplashScreen(),
          // home: const HomeScreen(),
        ),
      ),
    );
  }
}