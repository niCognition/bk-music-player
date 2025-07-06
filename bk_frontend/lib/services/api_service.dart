import 'dart:async';
import 'dart:convert';
import 'dart:html';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';


class ApiService {
  static String baseUrl = dotenv.env['BASE_URL'] ?? 'http://localhost:3000';
  static String apiKey = dotenv.env['API_KEY'] ?? '';

  /// Hämta alla tracks
  static Future<List<Map<String, dynamic>>> fetchAllTracks() async {
    final response = await http.get(
      Uri.parse('$baseUrl/tracks'),
      headers: {'x-api-key': apiKey},
    );

    if (response.statusCode == 200) {
      final List<dynamic> jsonData = jsonDecode(response.body);
      return List<Map<String, dynamic>>.from(jsonData);
    } else {
      throw Exception('Failed to fetch tracks');
    }
  }

  /// Sök tracks på titel
  static Future<List<Map<String, dynamic>>> searchTracks(String title) async {
    final response = await http.get(
      Uri.parse('$baseUrl/tracks/search?title=$title'),
      headers: {'x-api-key': apiKey},
    );

    if (response.statusCode == 200) {
      final List<dynamic> jsonData = jsonDecode(response.body);
      return List<Map<String, dynamic>>.from(jsonData);
    } else {
      throw Exception('Failed to search tracks');
    }
  }

  /// Ladda upp en låt med metadata
  static Future<Map<String, dynamic>> uploadTrack({
    required String title,
    required String artist,
    required String genre,
    required String description,
    required List<String> tags,
    required File mp3File,
  }) async {
    final uri = Uri.parse('$baseUrl/tracks');
    final request = http.MultipartRequest('POST', uri)
      ..headers['x-api-key'] = apiKey
      ..fields['title'] = title
      ..fields['artist'] = artist
      ..fields['genre'] = genre
      ..fields['description'] = description
      ..fields['tags'] = jsonEncode(tags);

    // Read file as bytes using FileReader
    final reader = FileReader();
    final completer = Completer<List<int>>();
    reader.readAsArrayBuffer(mp3File);
    reader.onLoadEnd.listen((event) {
      completer.complete(reader.result as List<int>);
    });
    reader.onError.listen((event) {
      completer.completeError(reader.error!);
    });
    final fileBytes = await completer.future;

    request.files.add(http.MultipartFile.fromBytes(
      'file',
      fileBytes,
      filename: mp3File.name,
      contentType: MediaType('audio', 'mpeg'),
    ));

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Upload failed: ${response.body}');
    }
  }
}