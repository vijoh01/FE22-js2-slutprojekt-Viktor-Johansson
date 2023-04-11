import { storeUser, removeUser } from "./auth";

const fetcher = async ({ header, method, body, json = true }: any) => {
    const init = {
        headers: {
            Accept: "application/json",
            "Content-type": "application/json"
        },
        body: body && JSON.stringify(body),
        method,
    }

    const res = await fetch(process.env.DATABASE_URL + `${header}.json`, init);
    if (!res.ok) {
        throw alert("API failed to fetch");
    }

    if (json) {
        return await res.json();
    }
};

export const getId = async (user: any) => {
    const existingUsers = await getUsers();
    const values: any = Object.values(existingUsers);
    return Object.getOwnPropertyNames(existingUsers).filter((usr: any, index) => {
        if (values[index].email === user.email) {
            return usr;
        }
    });
}

export const getPostsFromUser = async (user: any) => {
    const usr: any = await findUserFromEmail(user.email);
    return usr.posts;
}

export const uploadPost = async (user: any, post: any) => {
    const posts = await getPostsFromUser(user)

    const arr: any = posts != null ? posts : [];

    arr.push(post);

    user.posts = arr;
    console.log(await getId(user));

    return fetcher({
        header: `users/${await getId(user)}`,
        method: "PATCH",
        body: user,
        json: true,
    });
}

export const getUsers = async () => {
    return (await fetcher({
        header: "users",
        method: "GET",
        body: null,
        json: true,
    }));
}

export const findUserFromEmail = async (email: string) => {
    const existingUsers = await getUsers();
    const userArr: Array<any> = Object.values(existingUsers);
    const emailExists = userArr.filter(user => user.email === email);
    return emailExists[0];
}

export const register = async (user: any) => {
    const existingUsers = await getUsers();

    if (existingUsers !== null) {
        const emailExists = Object.values(existingUsers).find(
            (u: any) => u.email === user.email || u.username === user.username
        );
        if (emailExists) {
            return alert("Email or username already exists");
        }
    }

    storeUser(user.email);

    window.location.href = "../index.html";

    return fetcher({
        header: "users",
        method: "POST",
        body: user,
        json: true,
    });
};

export const deleteUser = async (user: any) => {
    return fetcher({
        header: `users/${await getId(user)}`,
        method: "DELETE",
        body: null,
        json: true,
    });
    
};

export const signin = async (user: any, navigate: boolean) => {
    const existingUsers = await getUsers();

    const emailExists = Object.values(existingUsers).filter(
        (u: any) => { if (u.email === user.email && u.password === user.password/*comparePasswords(u.password, user.password)*/) return u; }
    );


    if (emailExists.length === 0) {
        alert("User not found");
        return;
    }

    console.log("login", emailExists[0]);

    storeUser(user.email);
    if (navigate)
        window.location.href = "../index.html";

    return user;
};
