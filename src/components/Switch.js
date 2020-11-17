import React from "react";

/** A logic flow component for showing children conditionally.
 *
 *  If no condition prop is given child elements act as blocks in a if 
 *  statement. A Switch element will loop over each of it's children till
 *  it finds finds a child with a switch-if prop that evaluates to true or has
 *  no switch-if prop in which case it will be treated like an else clause in an
 *  if.
 *
 *  If a condition prop is given then the value of switch-if prop for each child
 *  will be companied to the value of the condition prop when evaluating which
 *  child will be rendered.
 */
const Switch = props => {
    let match = React.Children.toArray(props.children).find(child =>
        // child must be a react element to match
        React.isValidElement(child) && (
            // default case if no switch-if prop
            !('switch-if' in child.props) ||
            // test switch-if differently based on if parent has been given a 
            // condition
            ('condition' in props 
                ? child.props['switch-if'] === props.condition 
                : child.props['switch-if']
            )
        )
    )

    // Discard switch-if prop from child
    // React elements are immutable so we must recreate
    if (match?.type && match?.props && 'switch-if' in match.props) {
        match = React.cloneElement(match, {'switch-if': undefined})
    }

    return match || null
}
Switch.sampleProps = {
    'Condition given - match bar': {
        condition: 'bar',
        children: [
            <div switch-if="foo">foo</div>,
            <div switch-if="bar">bar</div>,
            <div>default</div>,
        ]
    },
    'Condition given - match foo': {
        condition: 'foo',
        children: [
            <div switch-if="foo">foo</div>,
            <div switch-if="bar">bar</div>,
            <div>default</div>,
        ]
    },
    'Condition given - no match - use default': {
        condition: 'cake',
        children: [
            <div switch-if="foo">foo</div>,
            <div switch-if="bar">bar</div>,
            <div>default</div>,
        ]
    },
    'Condition given - no match - no default': {
        condition: 'cake',
        children: [
            <div switch-if="foo">foo</div>,
            <div switch-if="bar">bar</div>,
        ]
    },
    'No condition - match first true': {
        children: [
            <div switch-if={ 1 === 2 }>first false</div>,
            <div switch-if={ 1 === 1 }>first true</div>,
            <div switch-if={ false }>second false</div>,
            <div switch-if={ true }>second true</div>,
            <div>default</div>,
        ]
    },
    'No condition - no match - use default': {
        children: [
            <div switch-if={ false }>first false</div>,
            <div switch-if={ 1 === 2 }>second false</div>,
            <div>default</div>,
        ]
    },
    'No condition - no match - no default': {
        children: [
            <div switch-if={ false }>first false</div>,
            <div switch-if={ 1 === 2 }>second false</div>,
        ]
    },
    'No condition - children contain text node - match first true': {
        children: [
            "foobar",
            <div switch-if={ 1 === 2 }>first false</div>,
            <div switch-if={ 1 === 1 }>first true</div>,
            <div switch-if={ false }>second false</div>,
            <div switch-if={ true }>second true</div>
        ]
    },
    'No condition - no children': {},
};

export default Switch