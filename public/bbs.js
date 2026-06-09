"use strict";

let number=0;
const bbs = document.querySelector('#bbs');

document.querySelector('#post').addEventListener('click', () => {  //投稿ボタンが押された
    const name = document.querySelector('#name').value;
    const message = document.querySelector('#message').value;

    if (name === "" || message === "") {
        alert("名前とメッセージを入力してください！");
        return;
    }

    const params = {  // URL Encode
        method: "POST",
        body:  `name=${encodeURIComponent(name)}&message=${encodeURIComponent(message)}`,//'name='+name+'&message='+message,  //送るパラメータ
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    console.log( params );
    const url = "/post";
    fetch( url, params )
    .then( (response) => {       //実行
        if( !response.ok ) {
            throw new Error('Error');
        }
        return response.json();   //次の.thenに返す
    })
    .then( (response) => {
        console.log( response );
        document.querySelector('#message').value = "";
        alert("投稿が完了しました");
    });
});

document.querySelector('#check').addEventListener('click', () => {
    const params = {
        method: "POST",
        body: '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    const url = "/check";
    fetch(url, params)
        .then((response) => {
            if (!response.ok) {
                throw new Error('チェックに失敗しました');
            }
            return response.json();
        })
        .then((response) => {
            const value = response.number;
            if (number != value) {
                const params = {
                    method: "POST",
                    body: `start=${number}`,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                const url = "/read";
                fetch(url, params)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('投稿の取得に失敗しました');
                        }
                        return response.json();
                    })
                    .then((response) => {
                        number += response.messages.length;
                        for (let mes of response.messages) {
                            addPost(mes);
                        }
                    });
            }
        });
});

function addPost(mes) {
    const cover = document.createElement('div');
    cover.className = 'cover';
    cover.dataset.id = mes.id;
    cover.style.backgroundColor = getRandomColor(); // 初期背景色を設定

    const nameArea = document.createElement('span');
    nameArea.className = 'name';
    nameArea.innerText = mes.name;

    const mesArea = document.createElement('span');
    mesArea.className = 'mes';
    mesArea.innerText = mes.message;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerText = '削除';
    deleteBtn.addEventListener('click', () => {
        deletePost(mes.id, cover);
    });

    const colorChangeBtn = document.createElement('button');
    colorChangeBtn.className = 'color-change-btn';
    colorChangeBtn.innerText = '色を変更';
    colorChangeBtn.addEventListener('click', () => {
        cover.style.backgroundColor = getRandomColor();
    });

    cover.appendChild(nameArea);
    cover.appendChild(mesArea);
    cover.appendChild(deleteBtn);
    cover.appendChild(colorChangeBtn);

    bbs.appendChild(cover);
}

function deletePost(id, postElement) {
    if (!confirm('この投稿を削除しますか？')) return;

    console.log("削除するID:",id);

    const params = {
        method: "POST",
        body: `id=${encodeURIComponent(id)}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    const url = `/bbs/${encodeURIComponent(id)}`;

    fetch(url, { method: "DELETE" })
        .then((response) => {
            console.log("レスポンスのステータス:", response.status); // ステータス確認
            if (!response.ok) throw new Error('削除に失敗しました');
            return response.json();
        })
        .then((data) => {
            console.log("サーバーのレスポンス:", data); // サーバーからのレスポンス確認
            postElement.remove(); // DOMから削除
            alert('投稿を削除しました');
        })
        .catch((error) => {
            console.error('削除エラー:', error);
            alert('投稿の削除に失敗しました');
        });
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}