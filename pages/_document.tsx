import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
	DocumentInitialProps,
} from 'next/document';

class MyDocument extends Document {
	static async getInitialProps(
		ctx: DocumentContext
	): Promise<DocumentInitialProps> {
		const initialProps = await Document.getInitialProps(ctx);

		return initialProps;
	}
	render() {
		const pageProps = this.props?.__NEXT_DATA__?.props?.pageProps;

		return (
			<Html>
				<Head>
					<link rel='preconnect' href='https://fonts.googleapis.com' />
					<link
						rel='preconnect'
						href='https://fonts.gstatic.com'
						crossOrigin='anonymous'
					/>
					<link
						href='https://fonts.googleapis.com/css2?family=Rubik&display=swap'
						rel='stylesheet'
					/>
				</Head>
				<body className={pageProps.hideScrollBar ? 'scrollbar-hide' : ''}>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
