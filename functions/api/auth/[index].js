import jwt from '@tsndr/cloudflare-worker-jwt'

function validateEmail(email) {
    const re = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    return re.test(email);
}

export async function onRequestGet(context) {
    const key = context.params.index;
    console.log(key);
    if (!validateEmail(key)) {
        return new Response(null, { status: 401 });
    }
    const response = await fetch(`https://connect.mailerlite.com/api/subscribers/${key}`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + context.env.MAILERLITE_APIKEY
        }
    });
    if (response.ok) {
        const responseBody = await response.json();
        if (responseBody.data.status == 'active') {
            const token = await jwt.sign({
                name: responseBody.data.fields.name,
                email: responseBody.data.email,
                exp: Math.floor(Date.now() / 1000) + (7 * 24 * (60 * 60))
            }, context.env.SECRET_JWT);
            return new Response(token);
        }
        return new Response(null, { status: 401 });
    } else return new Response(null, { status: 401 });
}