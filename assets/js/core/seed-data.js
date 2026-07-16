// ==================== SEED DATA ====================
function initData() {
  if (localStorage.getItem('lms_initialized')) return;

  // Categories (danh mục)
  DB.set('categories', [
    { id: 'cat1', name: 'Khoa học máy tính', description: 'Lập trình, thuật toán, cấu trúc dữ liệu' },
    { id: 'cat2', name: 'Toán học', description: 'Đại số, giải tích, thống kê' },
    { id: 'cat3', name: 'Vật lý', description: 'Cơ học, điện từ, quang học' },
    { id: 'cat4', name: 'Văn học', description: 'Tiểu thuyết, thơ, truyện ngắn' },
    { id: 'cat5', name: 'Kinh tế', description: 'Quản trị, tài chính, marketing' },
    { id: 'cat6', name: 'Ngoại ngữ', description: 'Tiếng Anh, tiếng Nhật, tiếng Pháp' },
  ]);

  // Authors (tác giả)
  DB.set('authors', [
    { id: 'au1', name: 'Nguyễn Văn Linh', nationality: 'Việt Nam', bio: 'Giáo sư Đại học Bách Khoa Hà Nội' },
    { id: 'au2', name: 'Trần Thị Mai', nationality: 'Việt Nam', bio: 'Tiến sĩ Toán học' },
    { id: 'au3', name: 'Robert C. Martin', nationality: 'Mỹ', bio: 'Tác giả Clean Code, chuyên gia phần mềm' },
    { id: 'au4', name: 'Donald Knuth', nationality: 'Mỹ', bio: 'Cha đẻ của phân tích thuật toán' },
    { id: 'au5', name: 'Nam Cao', nationality: 'Việt Nam', bio: 'Nhà văn lớn của Việt Nam' },
    { id: 'au6', name: 'Lê Hoàng Phương', nationality: 'Việt Nam', bio: 'Chuyên gia tài chính' },
  ]);

  // Books (sách)
  DB.set('books', [
    { id: 'b1', isbn: '978-0-13-110362-7', title: 'Lập trình C nâng cao', authorId: 'au1', categoryId: 'cat1', year: 2020, quantity: 5, available: 3, description: 'Sách học lập trình C từ cơ bản đến nâng cao', status: 'available' },
    { id: 'b2', isbn: '978-0-13-468599-1', title: 'Clean Code', authorId: 'au3', categoryId: 'cat1', year: 2008, quantity: 3, available: 2, description: 'Hướng dẫn viết code sạch và chuyên nghiệp', status: 'available' },
    { id: 'b3', isbn: '978-0-20-131452-9', title: 'The Art of Computer Programming', authorId: 'au4', categoryId: 'cat1', year: 2011, quantity: 2, available: 0, description: 'Kinh điển về thuật toán và cấu trúc dữ liệu', status: 'borrowed' },
    { id: 'b4', isbn: '978-0-13-235088-4', title: 'Giải tích Toán học', authorId: 'au2', categoryId: 'cat2', year: 2019, quantity: 8, available: 6, description: 'Giáo trình giải tích đại học', status: 'available' },
    { id: 'b5', isbn: '978-0-44-240524-9', title: 'Chí Phèo & Tuyển tập truyện ngắn', authorId: 'au5', categoryId: 'cat4', year: 2018, quantity: 10, available: 8, description: 'Tuyển tập tác phẩm của nhà văn Nam Cao', status: 'available' },
    { id: 'b6', isbn: '978-0-13-468501-4', title: 'Quản trị Tài chính', authorId: 'au6', categoryId: 'cat5', year: 2022, quantity: 4, available: 4, description: 'Nguyên lý quản trị tài chính doanh nghiệp', status: 'available' },
    { id: 'b7', isbn: '978-0-13-571056-2', title: 'Đại số tuyến tính', authorId: 'au2', categoryId: 'cat2', year: 2021, quantity: 6, available: 5, description: 'Giáo trình đại số tuyến tính', status: 'available' },
    { id: 'b8', isbn: '978-0-59-651798-1', title: 'JavaScript: The Good Parts', authorId: 'au3', categoryId: 'cat1', year: 2008, quantity: 3, available: 1, description: 'Tinh hoa của ngôn ngữ JavaScript', status: 'available' },
    { id: 'b9', isbn: '978-0-13-235082-2', title: 'Vật lý đại cương', authorId: 'au1', categoryId: 'cat3', year: 2020, quantity: 7, available: 7, description: 'Giáo trình vật lý đại học', status: 'available' },
    { id: 'b10', isbn: '978-0-52-103645-7', title: 'English Grammar in Use', authorId: 'au3', categoryId: 'cat6', year: 2019, quantity: 5, available: 3, description: 'Ngữ pháp tiếng Anh toàn diện', status: 'available' },
    { id: 'b11', isbn: '978-0-13-468505-2', title: 'Cấu trúc dữ liệu và giải thuật', authorId: 'au1', categoryId: 'cat1', year: 2021, quantity: 4, available: 4, description: 'Sách về cấu trúc dữ liệu và giải thuật', status: 'available' },
    { id: 'b12', isbn: '978-0-13-235080-8', title: 'Marketing căn bản', authorId: 'au6', categoryId: 'cat5', year: 2020, quantity: 3, available: 2, description: 'Giáo trình Marketing đại học', status: 'damaged' },
  ]);

  // Members (thành viên/sinh viên)
  DB.set('members', [
    { id: 'm1', code: 'SV001', name: 'Nguyễn Thị Hoa', email: 'hoa.nguyen@student.edu.vn', phone: '0901234567', address: 'Hà Nội', joinDate: '2023-09-01', status: 'active', accountId: 'acc3' },
    { id: 'm2', code: 'SV002', name: 'Trần Văn Minh', email: 'minh.tran@student.edu.vn', phone: '0912345678', address: 'Hà Nội', joinDate: '2023-09-01', status: 'active', accountId: 'acc4' },
    { id: 'm3', code: 'SV003', name: 'Lê Thị Lan', email: 'lan.le@student.edu.vn', phone: '0923456789', address: 'Hải Phòng', joinDate: '2023-09-01', status: 'locked', accountId: 'acc5' },
    { id: 'm4', code: 'SV004', name: 'Phạm Văn Đức', email: 'duc.pham@student.edu.vn', phone: '0934567890', address: 'Đà Nẵng', joinDate: '2024-02-01', status: 'active', accountId: 'acc6' },
    { id: 'm5', code: 'SV005', name: 'Hoàng Thị Thu', email: 'thu.hoang@student.edu.vn', phone: '0945678901', address: 'TP.HCM', joinDate: '2024-02-01', status: 'active', accountId: 'acc7' },
  ]);

  // Accounts (tài khoản)
  DB.set('accounts', [
    { id: 'acc1', username: 'admin', password: 'admin123', role: 'Admin', fullname: 'Nguyễn Admin', email: 'admin@library.edu.vn', status: 'active', createdAt: '2023-01-01' },
    { id: 'acc2', username: 'librarian1', password: 'lib123', role: 'Librarian', fullname: 'Nguyễn Thị Lan', email: 'librarian@library.edu.vn', status: 'active', createdAt: '2023-01-01', librarianId: 'lib1' },
    { id: 'acc3', username: 'student1', password: 'stu123', role: 'Member', fullname: 'Nguyễn Thị Hoa', email: 'hoa.nguyen@student.edu.vn', status: 'active', createdAt: '2023-09-01', memberId: 'm1' },
    { id: 'acc4', username: 'student2', password: 'stu123', role: 'Member', fullname: 'Trần Văn Minh', email: 'minh.tran@student.edu.vn', status: 'active', createdAt: '2023-09-01', memberId: 'm2' },
    { id: 'acc5', username: 'student3', password: 'stu123', role: 'Member', fullname: 'Lê Thị Lan', email: 'lan.le@student.edu.vn', status: 'locked', createdAt: '2023-09-01', memberId: 'm3' },
    { id: 'acc6', username: 'student4', password: 'stu123', role: 'Member', fullname: 'Phạm Văn Đức', email: 'duc.pham@student.edu.vn', status: 'active', createdAt: '2024-02-01', memberId: 'm4' },
    { id: 'acc7', username: 'student5', password: 'stu123', role: 'Member', fullname: 'Hoàng Thị Thu', email: 'thu.hoang@student.edu.vn', status: 'active', createdAt: '2024-02-01', memberId: 'm5' },
  ]);

  // Librarians
  DB.set('librarians', [
    { id: 'lib1', name: 'Nguyễn Thị Lan', email: 'librarian@library.edu.vn', phone: '0901234560', accountId: 'acc2' },
  ]);

  // System config
  DB.setObj('config', {
    maxBorrowDays: 14,
    maxBooksPerMember: 3,
    finePerDay: 2000,
    fineDamagedPercent: 50,
    fineLostPercent: 100,
    reminderDaysBefore: 2,
  });

  // Borrows (phiếu mượn)
  const today = new Date();
  const overdue = new Date(today); overdue.setDate(overdue.getDate() - 20);
  const overdueStr = overdue.toISOString().split('T')[0];
  const dueOverdue = new Date(today); dueOverdue.setDate(dueOverdue.getDate() - 6);
  const future = new Date(today); future.setDate(future.getDate() + 7);

  DB.set('borrows', [
    { id: 'br1', memberId: 'm1', librarianId: 'lib1', borrowDate: overdueStr, dueDate: dueOverdue.toISOString().split('T')[0], returnDate: null, status: 'overdue', note: '', fine: 0, bookIds: ['b3'] },
    { id: 'br2', memberId: 'm2', librarianId: 'lib1', borrowDate: '2024-06-01', dueDate: '2024-06-15', returnDate: '2024-06-13', status: 'returned', note: 'Trả đúng hạn', fine: 0, bookIds: ['b1'] },
    { id: 'br3', memberId: 'm1', librarianId: 'lib1', borrowDate: new Date(today.getTime() - 5 * 86400000).toISOString().split('T')[0], dueDate: future.toISOString().split('T')[0], returnDate: null, status: 'borrowing', note: '', fine: 0, bookIds: ['b8'] },
    { id: 'br4', memberId: 'm4', librarianId: 'lib1', borrowDate: '2024-05-20', dueDate: '2024-06-03', returnDate: '2024-06-10', status: 'returned', note: 'Trả muộn 7 ngày', fine: 14000, bookIds: ['b2'] },
    { id: 'br5', memberId: 'm3', librarianId: 'lib1', borrowDate: '2024-04-01', dueDate: '2024-04-15', returnDate: null, status: 'overdue', note: '', fine: 0, bookIds: ['b10'] },
  ]);

  localStorage.setItem('lms_initialized', '1');
}

