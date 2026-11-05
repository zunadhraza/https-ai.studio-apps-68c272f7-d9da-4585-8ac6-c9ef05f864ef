class Notice {
  final String id;
  final String title;
  final String department;
  final String description;
  final String author;
  final DateTime publishedDate;
  final bool isBookmarked;
  final String priority;

  const Notice({
    required this.id,
    required this.title,
    required this.department,
    required this.description,
    required this.author,
    required this.publishedDate,
    this.isBookmarked = false,
    this.priority = 'normal',
  });

  Notice copyWith({
    String? id,
    String? title,
    String? department,
    String? description,
    String? author,
    DateTime? publishedDate,
    bool? isBookmarked,
    String? priority,
  }) {
    return Notice(
      id: id ?? this.id,
      title: title ?? this.title,
      department: department ?? this.department,
      description: description ?? this.description,
      author: author ?? this.author,
      publishedDate: publishedDate ?? this.publishedDate,
      isBookmarked: isBookmarked ?? this.isBookmarked,
      priority: priority ?? this.priority,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'department': department,
      'description': description,
      'author': author,
      'publishedDate': publishedDate.toIso8601String(),
      'isBookmarked': isBookmarked,
      'priority': priority,
    };
  }

  factory Notice.fromJson(Map<String, dynamic> json) {
    return Notice(
      id: json['id'] as String,
      title: json['title'] as String,
      department: json['department'] as String,
      description: json['description'] as String,
      author: json['author'] as String,
      publishedDate: DateTime.parse(json['publishedDate'] as String),
      isBookmarked: json['isBookmarked'] as bool? ?? false,
      priority: json['priority'] as String? ?? 'normal',
    );
  }
}
