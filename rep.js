"use strict";

const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// 野球選手一覧ーーーーーーーーーーーーーーーーーーーーー
let players = [
  { id: 1, name: "大谷翔平", number: 17, position: "投手・指名打者", age: 30 },
  { id: 2, name: "近藤健介", number: 7, position: "外野手", age: 31 },
];

// 一覧
app.get("/players", (req, res) =>
  res.render("players", { data: players })
);

// 追加ページ
app.get("/players/create", (req, res) =>
  res.redirect( "/public/players_add.html")
);

// 詳細
app.get("/players/detail/:id", (req, res) => {
  const id = Number(req.params.id);
  const data = players.find(p => p.id === id);
  res.render("player_detail", { data });
});

// 追加処理
app.post("/players", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const maxId = players.length > 0 ? Math.max(...players.map(p => p.id)) : 0; //IDの重複を防ぐ
  const id = maxId + 1;
  const name = req.body.name;
  const number = req.body.number;
  const position = req.body.position;
  const age = req.body.age;
  players.push( { id: id, name: name, number: number, position: position, age: age } );
  console.log( players );
  res.render('players', {data: players} );
});



// 削除
app.get("/players/delete/:id", (req, res) => {
  const id = Number(req.params.id);
  players = players.filter(p => p.id !== id);
  res.redirect("/players");
});

// 編集ページ
app.get("/players/edit/:id", (req, res) => {
  const id = Number(req.params.id);
  const data = players.find(p => p.id === id);
  if (!data) return res.status(404).send("選手が見つかりません");
  res.render("player_edit", { data });
});

// 更新処理
app.post("/players/update/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = players.findIndex(p => p.id === id);
  players[index] = { id, ...req.body };
  res.redirect("/players");
});




// ---------------- Cities ----------------
let cities = [
  { id: 1, name: "Tokyo", country: "Japan", population: 13960000, industry: "Finance" },
  { id: 2, name: "New York", country: "USA", population: 8419000, industry: "Media" },
];

app.get("/cities", (req, res) => {
  const cities_r = [...cities].sort((a, b) => a.id - b.id);  //ID順に表示させるため
  res.render("cities", { data: cities_r });
});


app.get("/cities/create", (req, res) =>
  res.redirect("/public/cities_new.html")
);

app.get("/cities/detail/:id", (req, res) => {
  const id = Number(req.params.id);
  const data = cities.find(c => c.id === id);
  res.render("cities_detail", { data });
});

app.post("/cities", (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const country = req.body.country;
  const population = req.body.population;
  const industry = req.body.industry;
  cities.push( { id: id, name: name, country: country, population: population, industry: industry } );
  console.log( cities );
  res.redirect("/cities");
});

app.get("/cities/delete/:id", (req, res) => {
  const id = Number(req.params.id);
  cities = cities.filter(c => c.id !== id);
  res.redirect("/cities");
});

app.get("/cities/edit/:id", (req, res) => {
  const id = Number(req.params.id);
  const data = cities.find(c => c.id === id);
  res.render("cities_edit", { data });
});

app.post("/cities/update/:id", (req, res) => {
  const oldId = Number(req.params.id);
  const newId = Number(req.body.id);

  const index = cities.findIndex(c => c.id === oldId);
  if (index === -1) {
    return res.send("都市が見つかりません");
  }

  // ★ ID重複チェック
  if (cities.some(c => c.id === newId && c.id !== oldId)) {
    return res.send("そのIDは既に使われています");
  }

  cities[index] = {
    id: newId,
    name: req.body.name,
    country: req.body.country,
    population: req.body.population,
    industry: req.body.industry
  };

  console.log(cities);
  res.redirect("/cities");
});


// ---------------- Todos ----------------
let todos = [
  { id: 1, priority: 1, title: "レポート提出", detail: "12/26まで" },
  { id: 2, priority: 2, title: "バイト", detail: "12/11" },
];

app.get("/todos", (req, res) =>
  res.render("todos", { data: todos })
);

app.get("/todos/create", (req, res) =>
  res.redirect("/public/todos_new.html")
);

app.get("/todos/detail/:id", (req, res) => {
  const id = Number(req.params.id);
  const data = todos.find(t => t.id === id);
  res.render("todo_detail", { data });
});

app.post("/todos", (req, res) => {
  const maxId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) : 0;
  const id = maxId + 1;

  const newPriority = Number(req.body.priority);

  // ★ 既存の Todo の順位を繰り下げる
  todos = todos.map(t => {
    if (t.priority >= newPriority) {
      return { ...t, priority: t.priority + 1 };
    }
    return t;
  });
  const title = req.body.title;
  const detail = req.body.detail;
  todos.push( { id: id, title: title, priority: newPriority, detail: detail } );
  console.log( todos );
  res.redirect("/todos");
});

app.get("/todos/delete/:id", (req, res) => {
  const id = Number(req.params.id);

  const target = todos.find(t => t.id === id);
  if (!target) {return res.redirect("/todos");}

  const deletedPriority = target.priority;
  todos = todos.filter(t => t.id !== id);

  // 優先順位繰り上げ
  todos = todos.map(t => {
    if (t.priority > deletedPriority) {
      return { ...t, priority: t.priority - 1 };
    }
    return t;
  });

  console.log(todos);
  res.redirect("/todos");
});


app.get("/todos/edit/:id", (req, res) => {
  const id = Number(req.params.id);
  const data = todos.find(t => t.id === id);
  res.render("todo_edit", { data });
});

app.post("/todos/update/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find(t => t.id === id);
  const oldPriority = todo.priority;
  const newPriority = Number(req.body.priority);

  if (newPriority < oldPriority) {//繰り上げ
    todos = todos.map(t => {
      if (t.id !== id && t.priority >= newPriority && t.priority < oldPriority) {
        return { ...t, priority: t.priority + 1 };
      }
      return t;
    });
  } else if (newPriority > oldPriority) {//繰り下げ
    todos = todos.map(t => {
      if (t.id !== id && t.priority <= newPriority && t.priority > oldPriority) {
        return { ...t, priority: t.priority - 1 };
      }
      return t;
    });
  }

  todo.title = req.body.title;
  todo.detail = req.body.detail;
  todo.priority = newPriority;
  console.log(todos);
  res.redirect("/todos");
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
