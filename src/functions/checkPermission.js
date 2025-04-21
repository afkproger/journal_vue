import router from '@/router'

async function refreshToken() {
    const refresh = localStorage.getItem('refresh');
    const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh }),
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access', data.access);
        if (data.refresh) {
            localStorage.setItem('refresh', data.refresh);
        }
        return true;
    }

    return false;
}



async function makeFetch(url, method = 'GET', body = null) {
    let accessToken = localStorage.getItem('access');
    let refresh = localStorage.getItem('refresh');

    if (!accessToken) {
        const refreshed = await refreshToken();
        if (refreshed) {
            accessToken = localStorage.getItem('access');
        } else {
            redirectToLogin();
            return;
        }
    }
    if (!refresh) {
        await router.push('/login');
    }
    console.log(body);
    let options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    let response = await fetch(url, options);

    if (response.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
            accessToken = localStorage.getItem('access');
            options.headers['Authorization'] = `Bearer ${accessToken}`;
            response = await fetch(url, options);
        } else {
            redirectToLogin();
            return;
        }
    }

    return response;
}



const redirectToLogin = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    router.push('/login');
}

export default makeFetch;