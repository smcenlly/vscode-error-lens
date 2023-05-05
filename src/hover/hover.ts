import { CommandId } from 'src/commands';
import { type RuleDefinitionArgs } from 'src/commands/findLinterRuleDefinitionCommand';
import { Constants } from 'src/types';
import { extensionUtils } from 'src/utils/extensionUtils';
import { vscodeUtils } from 'src/utils/vscodeUtils';
import { MarkdownString, type Diagnostic } from 'vscode';

/**
 * Create hover tooltip for text editor decoration.
 */
export function createHoverForDiagnostic({
	diagnostic,
	messageEnabled,
	buttonsEnabled,
	sourceCodeEnabled,
}: {
	diagnostic: Diagnostic;
	messageEnabled: boolean;
	buttonsEnabled: boolean;
	sourceCodeEnabled: boolean;
}): MarkdownString | undefined {
	if (!messageEnabled && !buttonsEnabled && !sourceCodeEnabled) {
		return;
	}

	const markdown = new MarkdownString(undefined, true);
	markdown.supportHtml = true;
	markdown.isTrusted = true;

	const diagnosticTarget = extensionUtils.getDiagnosticTarget(diagnostic);
	const diagnosticCode = extensionUtils.getDiagnosticCode(diagnostic);

	// ──── Message ───────────────────────────────────────────────
	if (messageEnabled) {
		// markdown.appendMarkdown(`${vscodeUtils.createProblemIconMarkdown(diagnostic.severity === 0 ? 'error' : diagnostic.severity === 1 ? 'warning' : 'info')} `);
		markdown.appendCodeblock(diagnostic.message, 'plaintext');
	}
	// ──── Source Code ──────────────────────────────────────────
	if (sourceCodeEnabled) {
		const copyCodeButton = vscodeUtils.createButtonLinkMarkdown({
			text: '$(clippy) Copy',
			href: vscodeUtils.createCommandUri(CommandId.CopyProblemCode, { code: diagnosticCode }).toString(),
		});
		markdown.appendMarkdown('\n\n');
		markdown.appendMarkdown(`${diagnostic.source ?? '<No source>'} \`${diagnosticCode ?? '<No code>'}\` `);
		markdown.appendMarkdown(copyCodeButton);
	}
	// ──── Buttons ───────────────────────────────────────────────
	if (buttonsEnabled) {
		const exludeProblemButton = vscodeUtils.createButtonLinkMarkdown({
			text: '$(exclude) Exclude',
			href: vscodeUtils.createCommandUri(CommandId.ExcludeProblem, diagnostic).toString(),
			title: 'Exclude problem from Error Lens by source/code',
		});
		const openRuleDefinitionButton = vscodeUtils.createButtonLinkMarkdown({
			text: '$(file) Definition',
			href: vscodeUtils.createCommandUri(CommandId.FindLinterRuleDefinition, { source: diagnostic.source, code: diagnosticCode } satisfies RuleDefinitionArgs).toString(),
			title: 'Open diagnostic definition (linter file).',
		});

		markdown.appendMarkdown('\n\n');
		markdown.appendMarkdown(exludeProblemButton);
		markdown.appendMarkdown(Constants.NonBreakingSpaceSymbolHtml.repeat(2));
		markdown.appendMarkdown(openRuleDefinitionButton);

		if (diagnosticTarget) {
			markdown.appendMarkdown(Constants.NonBreakingSpaceSymbolHtml.repeat(2));
			const openDocsButton = vscodeUtils.createButtonLinkMarkdown({
				text: '$(book) Docs',
				href: vscodeUtils.createCommandUri(Constants.VscodeOpenCommandId, diagnosticTarget).toString(),
				title: 'Open diagnostic code or search it in default browser.',
			});
			markdown.appendMarkdown(openDocsButton);
		}
	}

	return markdown;
}

