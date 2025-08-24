export async function handler(params:any) {
    console.log('PostAgendamento', params);
    
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'PostAgendamento',
                input: params,
            },
            null,
            2
        ),
    };
    
}