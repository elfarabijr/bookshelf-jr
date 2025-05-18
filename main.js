/**
 * [
 *    {
 *      id: <number>
 *      title: <string>
 *      author: <string>
 *      year: <number>
 *      isComplete: <boolean>
 *    }
 * ]
 */

 const RENDER_EVENT = 'render-buku';
 const RENDER_SEARCH = 'render-search';
 const STORAGE_KEY = 'BOOKSHELF_APPS';
 const books = [];
 const filteredBooks = [];

 function isStorageExist(){
 	if (typeof (Storage) === undefined) {
 		alert('Browser ini tidak mendukung local storage');
 		return false;
 	}
 	return true;
 }

 function randId() {
 	return +new Date();
 }

 function generateObjBuku(bukuID, judul, penulis, tahun, selesai) {
 	return {
 		id: bukuID,
 		title: judul,
 		author: penulis,
 		year: parseInt(tahun),
 		isComplete: selesai
 	}
 }

 function makeItemBook(bookObj) {

 	const {id, title, author, year, isComplete} = bookObj;

 	const textTitle = document.createElement('p');
 	textTitle.innerText = title;
 	textTitle.classList.add('book_title');

 	const textAuthor = document.createElement('p');
 	textAuthor.innerText = 'Penulis: '+author;

 	const textTahun = document.createElement('p');
 	textTahun.innerText = 'Tahun: '+year;

 	const container = document.createElement('article');
 	container.setAttribute('id', id);
 	container.classList.add('book_item')
 	container.append(textTitle, textAuthor, textTahun);

 	const actionCont = document.createElement('div');
 	actionCont.classList.add('action');

 	const btnHps = document.createElement('button');
 	btnHps.innerText = 'Hapus'
 	btnHps.classList.add('second');
 	btnHps.addEventListener('click', function () {
 		klikBtnHpus(id, title);
 	});

 	const btnUbah = document.createElement('button');
 	btnUbah.innerText = 'Ubah'
 	btnUbah.classList.add('warn');
 	btnUbah.addEventListener('click', function () {
 		klikBtnUbah(id);
 	});

 	const btnPindah = document.createElement('button');
 	btnPindah.innerText = 'Pindahkan'
 	btnPindah.classList.add('primer');
 	btnPindah.addEventListener('click', function () {
 		klikBtnMove(id);
 	});

 	actionCont.append(btnHps, btnUbah, btnPindah);

 	if (isComplete) {

 		const badge = document.createElement('div');
 		badge.classList.add('isend');
 		badge.innerText= 'Finished';

 		container.append(badge, actionCont);
 	} else {
 		container.append(actionCont);
 	}

 	return container;
 }

 function cariBuku(id) {
 	for (const item of books) {
 		if (item.id === id) {
 			return item;
 		}
 	}
 	return null;
 }

 function cariIndexBuku(id) {
 	for (const index in books) {
 		if (books[index].id === id) {
 			return index;
 		}
 	}
 	return -1;
 }

 function loadDataFromStorage() {
 	const serializedData = localStorage.getItem(STORAGE_KEY);
 	let data = JSON.parse(serializedData);
 	books.length = 0;
 	filteredBooks.length = 0;

 	if (data !== null) {
 		for (const book of data) {
 			books.push(book);
 		}
 	}

 	document.dispatchEvent(new Event(RENDER_EVENT));
 }

 function addBuku() {
 	const bukuID = randId();
 	const judul = document.getElementById('inputBookTitle').value;
 	const penulis = document.getElementById('inputBookAuthor').value;
 	const tahun = document.getElementById('inputBookYear').value;
 	const selesai = document.getElementById('inputBookIsComplete').checked;

 	const objBuku = generateObjBuku(bukuID, judul, penulis, tahun, selesai);
 	books.push(objBuku);
 	document.dispatchEvent(new Event(RENDER_EVENT));
 	closeForm();
 	saveData();
 }

 function searchJudul() {
 	const btnRst = document.getElementById('resetSearch');
 	btnRst.style.display = 'block';

 	const cariJudul = document.getElementById('searchBookTitle').value;

 	const newDt = books.filter(it => it.title.toLowerCase().replace(/\s+/g, '').includes(cariJudul.toLowerCase().replace(/\s+/g, '')));
 	filteredBooks.length = 0;
 	Array.prototype.push.apply(filteredBooks, newDt);
 	document.dispatchEvent(new Event(RENDER_SEARCH));
 }

 function resetCari() {
 	document.getElementById('searchBookTitle').value = "";
 	const btnRst = document.getElementById('resetSearch');
 	btnRst.style.display = 'none';
 	loadDataFromStorage();
 }

 function updBuku() {
 	const idBuku = document.getElementById('idEdit').value;
 	const judul = document.getElementById('inputBookTitle').value;
 	const penulis = document.getElementById('inputBookAuthor').value;
 	const tahun = document.getElementById('inputBookYear').value;
 	const selesai = document.getElementById('inputBookIsComplete').checked;

 	const target = cariBuku(parseInt(idBuku));
 	if (target == null) return;

 	target.title = judul;
 	target.author = penulis;
 	target.year = parseInt(tahun);
 	target.isComplete = selesai;
 	
 	document.dispatchEvent(new Event(RENDER_EVENT));
 	closeForm();
 	saveData();
 }

 function klikNavButton(data) {
 	if (data =='list') {
 		var inp = document.getElementById('input_section');
 		var list = document.getElementById('book_shelf');
 		inp.style.display = 'none';
 		list.style.display = 'block';
 		resetCari();
 	} else {
 		document.getElementById('idEdit').value = "0";
 		const jdl = document.getElementById('judulForm');
 		jdl.innerText = 'Tambah Koleksi Buku Baru';
 		const btnSub = document.getElementById('bookSubmit');
 		btnSub.innerText = 'Masukkan Buku ke rak';
 		const btn = document.getElementById('bookCancel');
 		btn.style.display = 'none';

 		const formToReset = document.getElementById('inputBook');
 		formToReset.reset();
 		
 		var inp = document.getElementById('input_section');
 		var list = document.getElementById('book_shelf');
 		inp.style.display = 'block';
 		list.style.display = 'none';
 	}
 }

 function klikBtnHpus(id, title) {
 	const ya = confirm(`Hapus buku "${title}" dari rak?`);
 	if (ya) {
 		actionHapus(id);
 	}
 }

 function actionHapus(id) {
 	const target = cariIndexBuku(id);

 	if (target === -1) return;

 	books.splice(target, 1);
 	document.dispatchEvent(new Event(RENDER_EVENT));
 	saveData();
 }

 function klikBtnUbah(id) {
 	const target = cariBuku(id);

 	const jdl = document.getElementById('judulForm');
 	jdl.innerText = 'Ubah Informasi Buku';
 	const btnSub = document.getElementById('bookSubmit');
 	btnSub.innerText = 'Perbarui info buku';
 	const btn = document.getElementById('bookCancel');
 	btn.style.display = 'block';

 	document.getElementById('idEdit').value = target.id;
 	document.getElementById('inputBookTitle').value = target.title;
 	document.getElementById('inputBookAuthor').value = target.author;
 	document.getElementById('inputBookYear').value = target.year;
 	document.getElementById('inputBookIsComplete').checked = target.isComplete;

 	const inp = document.getElementById('input_section');
 	const list = document.getElementById('book_shelf');
 	inp.style.display = 'block';
 	list.style.display = 'none';
 }

 function klikBtnMove(id) {
 	const target = cariBuku(id);
 	if (target == null) return;

 	target.isComplete = !target.isComplete;
 	document.dispatchEvent(new Event(RENDER_EVENT));
 	saveData();
 }

 function saveData() {
 	if (isStorageExist()) {
 		const parsed = JSON.stringify(books);
 		localStorage.setItem(STORAGE_KEY, parsed);
 	}
 }

 function closeForm(){
 	document.getElementById('idEdit').value = "0";
 	const jdl = document.getElementById('judulForm');
 	jdl.innerText = 'Tambah Koleksi Buku Baru';
 	const btnSub = document.getElementById('bookSubmit');
 	btnSub.innerText = 'Masukkan Buku ke rak';
 	const btn = document.getElementById('bookCancel');
 	btn.style.display = 'none';

 	const formToReset = document.getElementById('inputBook');
 	formToReset.reset();

 	const inp = document.getElementById('input_section');
 	const list = document.getElementById('book_shelf');
 	inp.style.display = 'none';
 	list.style.display = 'block';
 }

 document.addEventListener('DOMContentLoaded', function () {
 	const submitForm = document.getElementById('inputBook');
 	submitForm.addEventListener('submit', function (event) {
 		event.preventDefault();
 		const cekId = document.getElementById('idEdit').value;
 		if (cekId != 0) {
 			updBuku()	
 		} else {
 			addBuku();
 		}
 	});

 	const searchForm = document.getElementById('searchBook');
 	searchForm.addEventListener('submit', function (event) {
 		event.preventDefault();
 		searchJudul();
 	});

 	if (isStorageExist()) {
 		loadDataFromStorage();
 	}
 });

 document.addEventListener(RENDER_EVENT, function () {
 	filteredBooks.length = 0;
 	const listSelesai = document.getElementById('completeBookshelfList');
 	const listBelum = document.getElementById('incompleteBookshelfList');
 	listSelesai.innerHTML = '';
 	listBelum.innerHTML = '';

 	const adaSelesai = books.some(item => item.isComplete);
 	if (!adaSelesai) {
 		const textData = document.createElement('p');
 		textData.innerText = 'Tidak ada data di rak ini';

 		const container = document.createElement('article');
 		container.classList.add('book_item')
 		container.append(textData);

 		listSelesai.append(container);
 	}

 	const adaBelum = books.some(item => !item.isComplete);
 	if (!adaBelum) {
 		const textData = document.createElement('p');
 		textData.innerText = 'Tidak ada data di rak ini';

 		const container = document.createElement('article');
 		container.classList.add('book_item')
 		container.append(textData);
 		
 		listBelum.append(container);
 	}

 	for (const bookItem of books) {
 		const bookElement = makeItemBook(bookItem);
 		if (bookItem.isComplete) {
 			listSelesai.append(bookElement);
 		} else {
 			listBelum.append(bookElement);
 		}
 	}
 });

 document.addEventListener(RENDER_SEARCH, function () {
 	const listSelesai = document.getElementById('completeBookshelfList');
 	const listBelum = document.getElementById('incompleteBookshelfList');
 	listSelesai.innerHTML = '';
 	listBelum.innerHTML = '';

 	const adaSelesai = filteredBooks.some(item => item.isComplete);
 	if (!adaSelesai) {
 		const textData = document.createElement('p');
 		textData.innerText = 'Tidak ada data di rak ini';

 		const container = document.createElement('article');
 		container.classList.add('book_item')
 		container.append(textData);

 		listSelesai.append(container);
 	}

 	const adaBelum = filteredBooks.some(item => !item.isComplete);
 	if (!adaBelum) {
 		const textData = document.createElement('p');
 		textData.innerText = 'Tidak ada data di rak ini';

 		const container = document.createElement('article');
 		container.classList.add('book_item')
 		container.append(textData);
 		
 		listBelum.append(container);
 	}

 	for (const bookItem of filteredBooks) {
 		const bookElement = makeItemBook(bookItem);
 		if (bookItem.isComplete) {
 			listSelesai.append(bookElement);
 		} else {
 			listBelum.append(bookElement);
 		}
 	}
 });