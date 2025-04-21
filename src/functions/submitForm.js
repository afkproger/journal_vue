async function submitForm(formData , url) {
    let status = false;
    let json = null;
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            json = await res.json();
            status = true;
        } else {
            json = await res.json();
        }
    } catch (err) {
        console.error('Ошибка при отправке запроса:', err);
    }
    return {
        status,
        json ,
    }
}


export default submitForm;