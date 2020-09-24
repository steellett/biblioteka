window.onload = () => {
    var map = L.map('map').setView([0.000100, 0.000150], 22, )

    var layerOneImg = './imgs/layer1.png',
        LayerOneBounds = [
            [0.000000, 0.000000],
            [0.000200, 0.000300]
        ];
    var layerTwoImg = './imgs/layer2.png',
        LayerTwoBounds = [
            [0.000000, 0.000000],
            [0.000200, 0.000300]
        ];

    let layerOne = L.imageOverlay(layerOneImg, LayerOneBounds).addTo(map);
    let layerTwo = L.imageOverlay(layerTwoImg, LayerTwoBounds).addTo(map);

    let coordinateX, coordinateY;

    let roomsFloorOne = {
        roomOne: {
            coordinates: [0.000150, 0.000075],
            name: 'Читальная комната 1'
        },
        roomTwo: {
            coordinates: [0.000150, 0.000150],
            name: 'Художественная литература'
        },
        roomThree: {
            coordinates: [0.000050, 0.000075],
            name: 'Туалет'
        },
        roomFour: {
            coordinates: [0.000050, 0.000150],
            name: 'Детская литература'
        },
        roomFive: {
            coordinates: [0.000050, 0.000250],
            name: 'Фантастика'
        },
    };
    let roomsFloorTwo = {
        roomOne: {
            coordinates: [0.000150, 0.000075],
            name: 'Читальная комната 1'
        },
        roomTwo: {
            coordinates: [0.000150, 0.000150],
            name: 'Читальная комната 2'
        },
        roomThree: {
            coordinates: [0.000050, 0.000075],
            name: 'Комната с тв'
        },
        roomFour: {
            coordinates: [0.000050, 0.000150],
            name: 'Чайная комната'
        },
        roomFive: {
            coordinates: [0.000050, 0.000250],
            name: 'Холл'
        },
    };
    let bookCases = [{
        coordinates: [0.000100, 0.000060],
        books: ['Война и мир. Л. Н. Толстой', 'Так говорил заратустра. Ф. Ницше']
    }, {
        coordinates: [0.000110, 0.000250],
        books: ['Бытие и время. М. Хайдеггер', 'Я и ОНО. З. Фрейд']
    }, {
        coordinates: [0.000080, 0.000130],
        books: ['Государство. Платон', 'Наука логики. Г. Гегель']
    }];

    function findBook() {
        document.querySelector('.found-books').innerHTML = '';
        let findtext = new RegExp(`${event.target.value}`, 'i');
        bookCases.forEach(bookCase => {
            let booklist = document.createElement('li');
            bookCase.books.forEach(book => {
                if (findtext.test(book)) {
                    booklist.innerHTML = book;
                    booklist.dataset.coordinates = bookCase.coordinates;
                    document.querySelector('.found-books').append(booklist)
                };
            })
        })

    };
    document.querySelector('.found-books-text').addEventListener('change', findBook)

    function setPopup(coordinates, text) {
        L.popup()
            .setLatLng([coordinates[0], coordinates[1]])
            .setContent(text)
            .openOn(map);
    };

    function chooseLayer(chosenLayer) {
        if (chosenLayer === 1) {
            layerOne.setOpacity(1)
            layerTwo.setOpacity(0)
        } else if (chosenLayer === 2) {
            layerOne.setOpacity(0)
            layerTwo.setOpacity(1)
        }
    };

    let chosenLayer = null;

    let layers = document.querySelector('.control-element__layers');
    layers.addEventListener('click', () => {
        if (event.target.closest('div').classList.contains('first-layer')) {
            document.querySelector('#first-layer__rooms').innerHTML = '<option value="" disabled selected>Выберите помещение</option>'
            document.querySelector('#second-layer__rooms').innerHTML = '<option value="" disabled selected>Выберите помещение</option>'
            chosenLayer = 1;
            chooseLayer(chosenLayer)
            addRoomsOptionsFirstFloor()
        } else if (event.target.closest('div').classList.contains('second-layer')) {
            document.querySelector('#first-layer__rooms').innerHTML = '<option value="" disabled selected>Выберите помещение</option>'
            document.querySelector('#second-layer__rooms').innerHTML = '<option value="" disabled selected>Выберите помещение</option>'
            chosenLayer = 2;
            chooseLayer(chosenLayer)
            addRoomsOptionsSecondFloor();
        } else return;
    });
    document.querySelector('.first-layer p').addEventListener('mouseover', () => {
        if (!event.target.tagName === 'P') return
        layerOne.setOpacity(1)
        layerTwo.setOpacity(0.2)
    })
    document.querySelector('.first-layer p').addEventListener('mouseout', () => {
        if (!event.target.tagName === 'P') return
        layerOne.setOpacity(1)
        layerTwo.setOpacity(0.0)
    })
    document.querySelector('.second-layer p').addEventListener('mouseover', () => {
        if (!event.target.tagName === 'P') return
        layerOne.setOpacity(0.2)
        layerTwo.setOpacity(1)
    })
    document.querySelector('.second-layer p').addEventListener('mouseout', () => {
        if (!event.target.tagName === 'P') return
        layerOne.setOpacity(0)
        layerTwo.setOpacity(1)
    });

    function showRoom(coordinates) {
        let coordArr = coordinates.split(',');
        setPopup(coordArr, 'Вам сюда')
    };

    function addRoomsOptionsFirstFloor() {
        let firstFloor = document.querySelector('#first-layer__rooms')
        for (room in roomsFloorOne) {
            let option = document.createElement('option');
            option.innerHTML = roomsFloorOne[room].name;
            option.value = roomsFloorOne[room].coordinates
            firstFloor.append(option);
        }
    };

    function addRoomsOptionsSecondFloor() {
        let secondFloor = document.querySelector('#second-layer__rooms')
        for (room in roomsFloorTwo) {
            let option = document.createElement('option');
            option.innerHTML = roomsFloorTwo[room].name;
            option.value = roomsFloorTwo[room].coordinates
            secondFloor.append(option);
        }
    };

    function searchRoom() {
        let roomName = new RegExp(`${event.target.closest('.search-place').querySelector('input').value}`, 'i');
        for (room in roomsFloorTwo) {
            if (roomName.test(roomsFloorTwo[room].name)) {
                setPopup(roomsFloorTwo[room].coordinates, 'Вам сюда')
            } else {
                setPopup([0.000100, 0.000150], 'Такой комнаты нет')
            }
        }
    }
    document.querySelector('.find-books-block').addEventListener('click', () => {
        if (event.target.tagName == 'LI') {
            event.target.closest('.find-books-block').querySelector('input').value = event.target.innerHTML;
            event.target.closest('.find-books-block').querySelector('input').dataset.coordinates = event.target.dataset.coordinates;
            showWhereBook();
            document.querySelector('.found-books').innerHTML = '';

        } else return;
    })

    function showWhereBook() {
        let coordinates = event.target.closest('.find-books-block').querySelector('input').dataset.coordinates.split(',')
        setPopup(coordinates, 'Ваша книга здесь')
    }

    document.querySelector('.search-place__button').addEventListener('click', searchRoom);

    document.querySelector('#first-layer__rooms').addEventListener('change', () => {
        showRoom(event.target.value)
    })
    document.querySelector('#second-layer__rooms').addEventListener('change', () => {
        showRoom(event.target.value)
    })
}