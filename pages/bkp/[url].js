export async function getServerSideProps(context) {
    const url = context.query.url;

    return {
        props: {
            url: url
        }
    }
}

function generatePDFbyURL2(props) {

    return <div>URL é: {props.url}</div>
}
export default generatePDFbyURL2;

