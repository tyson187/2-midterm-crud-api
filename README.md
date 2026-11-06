1. Most Challenging Part
Async Error Handling: The hardest part was handling asynchronous operations using async/await and returning clear error messages in JSON format without crashing the application.

Input Validation: I also needed to check user inputs carefully, such as making sure the email is valid and not already used by another user.
2. TypeORM vs. Raw SQL
TypeORM Entities: TypeORM allows us to represent database tables using TypeScript classes. This means we can use built-in methods instead of writing SQL queries manually.

Type Safety and Auto-complete: TypeORM helps us find coding errors early and makes writing code easier with suggestions from the editor.
3. Hiding Passwords
Why: Passwords are private information, so they should not appear in API responses.

Implementation: I used select: false in the password column to prevent it from being selected by default. I also used destructuring to remove the password before returning the user data.
4. When to Use Database Transactions
Example: An online store checkout, where the system creates an order, reduces product stock, and deducts the customer's balance.

Why: Transactions make sure all operations succeed together. If one operation fails, the system can undo the other changes to keep the database correct.
5. synchronize: true vs. Migrations
synchronize: true: Automatically updates the database structure when the application starts. It is suitable for development but can cause data problems in production.

Migrations: These are controlled database changes that developers can track and manage. They are safer for production because changes are applied deliberately.
6. Adding a Comment Entity (One-to-Many Relationship)
Comment Entity: I used @ManyToOne to connect each comment to one task. A task can have many comments.

Task Entity: I used @OneToMany to allow one task to have multiple comments.

Configuration: I also registered the Comment entity in the TypeORM configuration so the system could recognize it.
7. Security Improvements for Production
- Password Hashing: Use bcrypt or Argon2 to protect passwords before saving them in the database.
- Authentication: Use JWT or session tokens to make sure only authorized users can access protected features.
- Rate Limiting: Use express-rate-limit to limit repeated requests and help prevent brute-force attacks.
- Input Validation: Check user inputs to prevent invalid data.
- Environment Settings: Set NODE_ENV=production, disable automatic database synchronization, restrict CORS to trusted websites, and use Helmet to improve security.
8. The ! (Definite Assignment Operator)
The ! symbol tells TypeScript that a property will be given a value later, even if it is not assigned in the constructor.

In TypeORM, this is useful because TypeORM can fill in the property when it loads data from the database.

Example:
comments!: Comment[];


9. Explicit Column Types (type: 'varchar')
Specifying a column type, such as varchar, tells the database what kind of data the column should store.

It also helps define limits, such as the maximum number of characters allowed. This makes the database structure clearer and more consistent.
10. TypeORM Relationships vs. Raw SQL Foreign Keys
Difference: TypeORM uses decorators such as @ManyToOne and @OneToMany to define relationships between database tables. Raw SQL requires developers to manage foreign keys and JOIN queries more directly.

Advantages: TypeORM makes relationships easier to manage, allows related data to be loaded using repository options, and provides TypeScript type checking.