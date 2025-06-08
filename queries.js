// Find all books in a specific genre
db.books.find({ genre: "Fiction" });

// Find books published after a certain year
db.books.find({ published_year: { $gt: 2000 } });

// Find books by a specific author
db.books.find({ author: "George Orwell" });

// Update the price of a specific book
db.books.updateOne({ title: "1984" }, { $set: { price: 13.99 } });

// Delete a book by its title
db.books.deleteOne({ title: "Moby Dick" });

// --- Advanced Queries ---

// Find books that are in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } });

// Projection: Return only title, author, and price
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 });

// Sort books by price (ascending)
db.books.find().sort({ price: 1 });

// Sort books by price (descending)
db.books.find().sort({ price: -1 });

// Pagination: 5 books per page
// Page 1
db.books.find().skip(0).limit(5);
// Page 2
db.books.find().skip(5).limit(5);

// --- Aggregation Pipelines ---

// Average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } },
]);

// Author with the most books
db.books.aggregate([
  { $group: { _id: "$author", bookCount: { $sum: 1 } } },
  { $sort: { bookCount: -1 } },
  { $limit: 1 },
]);

// Group books by publication decade
db.books.aggregate([
  {
    $group: {
      _id: {
        decade: {
          $concat: [
            {
              $toString: {
                $multiply: [
                  { $floor: { $divide: ["$published_year", 10] } },
                  10,
                ],
              },
            },
            "s",
          ],
        },
      },
      count: { $sum: 1 },
    },
  },
]);

// --- Indexing ---

// Create an index on title
db.books.createIndex({ title: 1 });

// Create a compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

// Use explain() to demonstrate index use
db.books.find({ title: "1984" }).explain("executionStats");
