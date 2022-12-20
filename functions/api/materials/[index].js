import jwt from '@tsndr/cloudflare-worker-jwt'

export async function onRequestGet(context) {
    const token = context.request.headers.get('Authorization');
    const key = context.params.index;
    let task = await context.env.dev.get(key);
    if (task == null) return new Response(null, { status: 404 });
    task = JSON.parse(task)
    if (token
        && token.startsWith("Bearer ")
        && (await jwt.verify(token.split(" ")[1], context.env.SECRET_JWT))) {
        task.authorized = true;
        return new Response(JSON.stringify(task));
    }
    else {
        task.sessions.forEach(session => delete session.vimeoId);
        task.authorized = false;
        return new Response(JSON.stringify(task));
    }
}