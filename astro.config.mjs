// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://thok404.github.io',
	base: '/RemotePhotoDocs',
	integrations: [
		starlight({
			title: 'RemotePhotoSystemDocs',
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'English',
					lang: 'en',
				},
				'ja': {
					label: '日本語',
					lang: 'ja',
				},
				'zh': {
					label: '中文',
					lang: 'zh',
				},
				'ko': {
					label: '한국어',
					lang: 'co',
				},
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
