import "regenerator-runtime/runtime";

class Fetching {
    getResourse = async url => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status ${res.status}`);
        }

        return await res.json();
    };

    putResourse = async (url, data) => {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return await res.json();
    };

    postResourse = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error(`Could not put ${url}, status ${res.status}`);
        } else {
            console.log(data, "отправлено");
        }

        return await res.json();
    };

    postImageForm = async (url, formData) => {
        const res = await fetch(url, {
            method: "POST",
            body: formData,
        });
        console.log(formData, "отправлено");
        return await res.json();
    };

    deleteResourse = async (url, id) => {
        await fetch(`${url}/${id}`, {
            method: "DELETE",
        });
        console.log(id, "Удален с сервера");
    };
}

export default Fetching;
