import { register, signin, uploadPost, getUsers, deleteUser } from "./lib/api";
import { getUserFromStorage, hasLoggedIn, removeUser} from "./lib/auth";
import img0 from '../images/img0.jpg';
import img1 from '../images/img1.jpg';
import img2 from '../images/img2.jpg';

export let currentUser: any;

const registerUser: any = document.querySelector('.registerUser');
const signinUser: any = document.querySelector('.signinUser');

if (registerUser != null)
  registerUser.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await register(getUserData(true));

  })

if (signinUser != null)
  signinUser.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    currentUser = await signin(getUserData(false), true);
    if (currentUser !== null) loadUserSignedin();
  })

async function checkForUser() {
  let usr = await getUserFromStorage();
  if (usr != null)
  if (hasLoggedIn()) {
    currentUser = await signin(usr, false);
    if (currentUser !== null) loadUserSignedin();
  }
}
const container: any = document.querySelector('.container');
const main: any = document.querySelector('main');

function getImage(type: string) {
  let img;
  switch (type) {
    case "img0":
      img = img0;
      break;
    case "img1":
      img = img1;
      break;
    case "img2":
      img = img2;
      break;
  }
  return img;
}

if (currentUser == null)
  checkForUser();

async function loadUserList() {
  const existingUsers = await getUsers();
  let userArr: Array<any> = Object.values(existingUsers);
  const list = userArr.sort((a: any, b: any) => {
    if (a.posts && b.posts) {
      return b.posts.length - a.posts.length;
    } else if (a.posts) {
      return -1;
    } else if (b.posts) {
      return 1;
    } else {
      return 0;
    }
  });

  list.forEach((users, index) => {
    const postCard = document.createElement('div');
    const post = document.createElement('div');
    post.className = "postLayout card" + index;
    const img = document.createElement('img');
    img.className = "userProfile card" + index;
    img.src = getImage(users.img);
    console.log(img.src);


    post?.append(img);
    postCard.className = "postCard card" + index;

    const title = document.createElement('h3');
    title.className = "post card" + index;
    title.innerText = users.username;

    post.append(title);
    const posts = document.createElement('h4');
    posts.className = "postAmount card" + index;
    if (users.posts == null) {
      posts.innerText = "Posts: none";
    } else {
      posts.innerText = "Posts: " + users.posts.length;
      users.posts.reverse();
    }
    post.append(posts);

    postCard.append(post);
    container?.append(postCard);

  })

  if (container !== null)
    container.addEventListener('click', async (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as Element;

      list.forEach((user: any, index) => {
        if (target.classList.contains("card" + index)) {
          loadPostList(user);
        }
      });
    });

}

function loadPostList(user: any) {
  container.innerHTML = "<div></div>";

  let userProfile = document.createElement('div');

  const title = document.createElement('h1');
  title.style.textAlign = "center";
  title.innerText = user.username;

  userProfile.append(title);

  const img = document.createElement('img');
  img.className = "userImage";
  img.src = getImage(user.img)
  userProfile.append(img);
  container.append(userProfile);
  userProfile.className = "postContainer";

  const posts: Array<any> = user.posts;
  if (posts != null)
  posts.forEach(post => {
    let postFrame = document.createElement('div');
    postFrame.className = "postFrame"
    let postText = document.createElement('p');
    postText.innerText = post.text;
    postFrame.append(postText);
    userProfile.append(postFrame);
  })

}

const close: any = document.querySelector('#close-post');
const box: any = document.querySelector('#postBox');
box.classList.add("hide");
close.addEventListener("click", () => {
  box.classList.add("hide");
})

loadUserList();

function getUserData(register: boolean) {
  const email = document.querySelector('.email') as HTMLInputElement;
  const username = document.querySelector('.username') as HTMLInputElement;
  const password = document.querySelector('.password') as HTMLInputElement;
  var selected: any = document.querySelector('input:checked');

  const user: any = {
    email: email.value,
    password: password.value,
  }


  if (register) {
    user["username"] = username.value;
    var className = "";
    className = selected.classList[0];
    alert(className);
    user["img"] = className;
  }

  return user;
}

let uploadBtn = document.querySelector('.upload');

export async function loadUserSignedin() {

  let signinBtn: any = document.querySelector('.signinBtn');
  let btns = document.querySelector('.btns');
  let userSelect = document.createElement('select');

  let userOption = document.createElement('option');
  let userText = document.createTextNode(currentUser.username);

  userOption.appendChild(userText);

  let logoutOption = document.createElement('option');
  let logoutText = document.createTextNode("Logout");
  logoutOption.appendChild(logoutText);
  let deleteOption = document.createElement('option');
  let deleteText = document.createTextNode("Delete");
  deleteOption.appendChild(deleteText);
  userSelect.appendChild(userOption);
  userSelect.appendChild(logoutOption);
  userSelect.appendChild(deleteOption);

  btns?.appendChild(userSelect);

  console.log("he");
  signinBtn?.remove();
  uploadBtn?.classList.add('show');
  logoutOption.addEventListener('click', function (e) {
    userSelect.remove();
    console.log("Logging out...");
    btns?.append(signinBtn);
    uploadBtn?.remove();
    window.location.href = "../index.html";
    removeUser();
  });
  deleteOption.addEventListener('click', async function (e) {
    e.preventDefault();
    await deleteUser(currentUser).then(a => window.location.href = "../index.html");
  });

  if (currentUser.posts != null) {
    currentUser.posts.reverse();
    userOption.addEventListener('click', function (e) {
      loadPostList(currentUser);
    });
  }

}

const submit: any = document.querySelector('#submit-button');
const text: any = document.querySelector('#post-text');
submit.addEventListener("click", async () => {
  console.log(text.value);
  await uploadPost(currentUser, { text: text.value })
  window.location.href = "../index.html";
})

uploadBtn?.addEventListener("click", (e) => {
  box.classList.remove("hide");
})